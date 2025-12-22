import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

interface DebateAnalysisRequest {
  ticker: string
  quickMode?: boolean
  quiet?: boolean
}

interface DebateAnalysisResponse {
  success: boolean
  ticker: string
  result?: any
  error?: string
  output?: string
}

/**
 * POST /api/debate-agents
 *
 * Run multi-agent debate analysis on a stock ticker using the debate-agents-js library.
 *
 * @example
 * POST /api/debate-agents
 * {
 *   "ticker": "AAPL",
 *   "quickMode": false,
 *   "quiet": true
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: DebateAnalysisRequest = await request.json()
    const { ticker, quickMode = false, quiet = true } = body

    if (!ticker) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: ticker' },
        { status: 400 }
      )
    }

    // Validate ticker format
    if (!/^[A-Z0-9._-]+$/.test(ticker.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid ticker format' },
        { status: 400 }
      )
    }

    // Path to the debate-agents-js directory
    const debateAgentsPath = path.join(process.cwd(), 'lib', 'debate-agents-js')
    const runnerPath = path.join(debateAgentsPath, 'simple-runner.js')

    console.log(`Running debate analysis for ${ticker}...`)

    // Execute the analysis using spawn for better control
    const result: any = await new Promise((resolve, reject) => {
      const args = ['--ticker', ticker.toUpperCase()]
      if (quickMode) args.push('--quick')

      const child = spawn('node', [runnerPath, ...args], {
        cwd: debateAgentsPath,
        env: {
          ...process.env,
          GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
          FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
          TAVILY_API_KEY: process.env.TAVILY_API_KEY,
          EODHD_API_KEY: process.env.EODHD_API_KEY,
          OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        },
        timeout: 300000, // 5 minutes
      })

      let stdout = ''
      let stderr = ''
      let jsonResult: any = null

      child.stdout.on('data', (data) => {
        const output = data.toString()
        stdout += output

        // Try to extract JSON result
        const jsonMatch = output.match(/\{[\s\S]*?"final_trade_decision"[\s\S]*?\}(?=\n|$)/m)
        if (jsonMatch) {
          try {
            jsonResult = JSON.parse(jsonMatch[0])
          } catch (e) {
            // Continue collecting output
          }
        }
      })

      child.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      child.on('error', (error) => {
        reject(error)
      })

      child.on('close', (code) => {
        if (code === 0) {
          // Success - try to find final JSON in full output
          if (!jsonResult) {
            const fullJsonMatch = stdout.match(/\{[\s\S]*?"final_trade_decision"[\s\S]*?\}/m)
            if (fullJsonMatch) {
              try {
                jsonResult = JSON.parse(fullJsonMatch[0])
              } catch (e) {
                console.warn('Failed to parse JSON from output')
              }
            }
          }

          resolve({
            ...jsonResult,
            raw_output: quiet ? undefined : stdout,
            stderr: stderr || undefined
          })
        } else {
          reject(new Error(`Process exited with code ${code}\n${stderr || stdout}`))
        }
      })

      // Set timeout
      setTimeout(() => {
        child.kill('SIGTERM')
        reject(new Error('Analysis timed out after 5 minutes'))
      }, 300000)
    })

    const response: DebateAnalysisResponse = {
      success: true,
      ticker: ticker.toUpperCase(),
      result,
      output: quiet ? undefined : stdout
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Debate analysis error:', error)

    // Handle timeout errors
    if (error.killed && error.signal === 'SIGTERM') {
      return NextResponse.json(
        {
          success: false,
          error: 'Analysis timed out after 5 minutes. Try using quickMode: true for faster results.'
        },
        { status: 504 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Analysis failed',
        output: error.stderr || error.stdout
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/debate-agents?ticker=AAPL
 *
 * Quick analysis endpoint - uses quick mode by default
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ticker = searchParams.get('ticker')

  if (!ticker) {
    return NextResponse.json(
      { success: false, error: 'Missing required parameter: ticker' },
      { status: 400 }
    )
  }

  // Convert GET to POST with quick mode enabled
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({
        ticker,
        quickMode: true,
        quiet: true
      })
    })
  )
}
