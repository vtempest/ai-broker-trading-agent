#!/usr/bin/env node

/**
 * api-mcp-server - MCP Server
 * 
 * Features:
 * - 33 API tools available
 * - Built-in Inspector at http://localhost:3000/inspector
 */

import 'dotenv/config';
import { MCPServer } from 'mcp-use/server';
import { z } from 'zod';
import { executeRequest } from './http-client.js';
import { toolConfigMap } from './tools-config.js';

// ============================================================================
// Configuration
// ============================================================================

const PORT = parseInt(process.env.PORT || '3000');
const isDev = process.env.NODE_ENV !== 'production';

// API configuration
const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'https://autoinvestment.broker/api',
  headers: {},
};

// Set up authentication headers
if (process.env.API_KEY) {
  apiConfig.headers['Authorization'] = `Bearer ${process.env.API_KEY}`;
}

if (process.env.API_AUTH_HEADER) {
  const [key, ...valueParts] = process.env.API_AUTH_HEADER.split(':');
  const value = valueParts.join(':'); // Handle values with colons
  if (key && value) {
    apiConfig.headers[key.trim()] = value.trim();
  }
}

// ============================================================================
// Server Setup
// ============================================================================

const server = new MCPServer({
  name: 'api-mcp-server',
  version: '1.0.0',
  description: 'MCP server generated from OpenAPI specification',
  baseUrl: process.env.MCP_URL || `http://localhost:${PORT}`,
  allowedOrigins: isDev 
    ? undefined  // Development: allow all origins
    : process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || [],
});

// ============================================================================
// Tool Registrations
// ============================================================================

// Get trending stocks
server.tool('get_stocks_trending', {
  description: 'Get trending stocks',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_stocks_trending');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get delisted stocks
server.tool('get_stocks_delisted', {
  description: 'Get delisted stocks',
  parameters: z.object({
    symbol: z.string().optional().describe('Optional: Check if specific symbol is delisted'),
    exchange: z.string().optional().describe('Exchange code (default: US). Examples: US, LSE, TO'),
    limit: z.number().int().optional().describe('Number of results to return (default: 50)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_stocks_delisted');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get user settings
server.tool('get_user_settings', {
  description: 'Get user settings',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_user_settings');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Save user settings
server.tool('post_user_settings', {
  description: 'Save user settings',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_user_settings');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get algo scripts
server.tool('get_strategies_algo_scripts', {
  description: 'Get algo scripts',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_strategies_algo_scripts');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Sync Zulu Traders
server.tool('post_zulu_sync', {
  description: 'Sync Zulu Traders',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_zulu_sync');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Search Zulu traders
server.tool('get_zulu_search', {
  description: 'Search Zulu traders',
  parameters: z.object({
    minRoi: z.number().optional().describe('Minimum ROI percentage'),
    minWinRate: z.number().optional().describe('Minimum Win Rate percentage'),
    maxDrawdown: z.number().optional().describe('Maximum Drawdown percentage'),
    isEa: z.boolean().optional().describe('Filter by EA (Expert Advisor) usage'),
    limit: z.number().int().optional().describe('Max results (default: 50)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_zulu_search');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get top ranked traders
server.tool('get_zulu_top_rank', {
  description: 'Get top ranked traders',
  parameters: z.object({
    limit: z.number().int().optional().describe('Max results (default 50)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_zulu_top_rank');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get prediction markets
server.tool('get_polymarket_markets', {
  description: 'Get prediction markets',
  parameters: z.object({
    limit: z.number().int().optional().describe('Max results (default: 20)'),
    window: z.string().optional().describe('Time window for sorting (24h, total)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_polymarket_markets');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get trader positions
server.tool('post_polymarket_positions', {
  description: 'Get trader positions',
  parameters: z.object({
    requestBody: z.object({
    trader_id: z.string()
  }).optional().describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_polymarket_positions');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Autocomplete stock search
server.tool('get_stocks_autocomplete', {
  description: 'Autocomplete stock search',
  parameters: z.object({
    q: z.string().describe('Search query string'),
    limit: z.number().int().optional().describe('Max results (default: 10)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_stocks_autocomplete');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get sector information
server.tool('get_stocks_sectors', {
  description: 'Get sector information',
  parameters: z.object({
    sector: z.string().optional().describe('Optional: Filter by specific sector name (e.g., \'Technology\')'),
    includeCompanies: z.boolean().optional().describe('Include top 10 companies for each sector (default: false)'),
    includeIndustries: z.boolean().optional().describe('Include industry breakdown for each sector (default: false)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_stocks_sectors');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get top gainers
server.tool('get_stocks_gainers', {
  description: 'Get top gainers',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_stocks_gainers');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Search stocks
server.tool('get_stocks_search', {
  description: 'Search stocks',
  parameters: z.object({
    q: z.string().describe('Search query')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_stocks_search');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get stock quote
server.tool('get_stocks_quote_symbol', {
  description: 'Get stock quote',
  parameters: z.object({
    symbol: z.string().describe('Stock symbol (e.g., AAPL)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_stocks_quote_symbol');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get historical data
server.tool('get_stocks_historical_symbol', {
  description: 'Get historical data',
  parameters: z.object({
    symbol: z.string().describe('Stock symbol'),
    period: z.string().optional().describe('Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, max)'),
    interval: z.string().optional().describe('Data interval (1m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_stocks_historical_symbol');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Screen stocks
server.tool('post_stocks_screener', {
  description: 'Screen stocks',
  parameters: z.object({
    requestBody: z.unknown().optional().describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_stocks_screener');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Calculate stock statistics
server.tool('post_stocks_predict_statistics', {
  description: 'Calculate stock statistics',
  parameters: z.object({
    requestBody: z.unknown().optional().describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_stocks_predict_statistics');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Analyze stock with AI agents
server.tool('post_trading_agents', {
  description: 'Analyze stock with AI agents',
  parameters: z.object({
    requestBody: z.unknown().optional().describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_trading_agents');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get debate analysis system info
server.tool('get_groq_debate', {
  description: 'Get debate analysis system info',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_groq_debate');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Multi-agent debate analysis
server.tool('post_groq_debate', {
  description: 'Multi-agent debate analysis',
  parameters: z.object({
    requestBody: z.object({
    symbol: z.string().describe('Stock ticker symbol'),
    date: z.string().date().optional().describe('Analysis date (defaults to today)'),
    max_debate_rounds: z.number().int().optional().describe('Number of debate rounds between Bull and Bear analysts'),
    llm_provider: z.enum(['groq', 'openai', 'anthropic']).optional().describe('LLM provider to use'),
    deep_think_llm: z.string().optional().describe('Model for complex reasoning (defaults to provider\'s best model)'),
    quick_think_llm: z.string().optional().describe('Model for fast analysis (defaults to provider\'s fast model)')
  }).describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_groq_debate');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Run strategy backtest
server.tool('post_backtest', {
  description: 'Run strategy backtest',
  parameters: z.object({
    requestBody: z.unknown().optional().describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_backtest');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Run technical strategy backtest
server.tool('post_backtest_technical', {
  description: 'Run technical strategy backtest',
  parameters: z.object({
    requestBody: z.object({
    symbol: z.string().optional(),
    strategy: z.enum(['momentum', 'mean-reversion', 'breakout', 'day-scalp']).optional(),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional()
  }).optional().describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_backtest_technical');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Quick multi-agent debate analysis
server.tool('get_debate_agents', {
  description: 'Quick multi-agent debate analysis',
  parameters: z.object({
    ticker: z.string().describe('Stock ticker symbol (e.g., AAPL, NVDA, TSLA)')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_debate_agents');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Run multi-agent debate analysis
server.tool('post_debate_agents', {
  description: 'Run multi-agent debate analysis',
  parameters: z.object({
    requestBody: z.object({
    ticker: z.string().describe('Stock ticker symbol'),
    quickMode: z.boolean().optional().describe('Use quick mode (Gemini Flash) for faster analysis'),
    quiet: z.boolean().optional().describe('Return only final results without verbose output')
  }).describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_debate_agents');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get company SEC filings
server.tool('get_sec_companies_tickerOrCik_filings', {
  description: 'Get company SEC filings',
  parameters: z.object({
    tickerOrCik: z.string().describe('Stock ticker or CIK number')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_sec_companies_tickerOrCik_filings');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get user portfolio
server.tool('get_user_portfolio', {
  description: 'Get user portfolio',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_user_portfolio');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Initialize portfolio
server.tool('post_user_portfolio_initialize', {
  description: 'Initialize portfolio',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_user_portfolio_initialize');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get user strategies
server.tool('get_user_strategies', {
  description: 'Get user strategies',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_user_strategies');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Create strategy
server.tool('post_user_strategies', {
  description: 'Create strategy',
  parameters: z.object({
    requestBody: z.unknown().optional().describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('post_user_strategies');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Update strategy
server.tool('put_user_strategies_id', {
  description: 'Update strategy',
  parameters: z.object({
    id: z.string(),
    requestBody: z.unknown().optional().describe('Request body')
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('put_user_strategies_id');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Delete strategy
server.tool('delete_user_strategies_id', {
  description: 'Delete strategy',
  parameters: z.object({
    id: z.string()
  }),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('delete_user_strategies_id');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// Get user signals
server.tool('get_user_signals', {
  description: 'Get user signals',
  parameters: z.object({}),
  execute: async (params) => {
    const toolConfig = toolConfigMap.get('get_user_signals');
    const result = await executeRequest(toolConfig, params, apiConfig);
    
    if (result.ok) {
      return typeof result.data === 'string' 
        ? result.data 
        : JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(`API Error (${result.status}): ${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
      }`);
    }
  },
});

// ============================================================================
// Start Server
// ============================================================================

server.listen(PORT);

console.log(`
🚀 api-mcp-server MCP Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Server:    http://localhost:${PORT}
🔍 Inspector: http://localhost:${PORT}/inspector
📡 MCP:       http://localhost:${PORT}/mcp
🔄 SSE:       http://localhost:${PORT}/sse

🛠️  Tools Available: 33
   • get_stocks_trending
   • get_stocks_delisted
   • get_user_settings
   • post_user_settings
   • get_strategies_algo_scripts
   ... and 28 more
Environment: ${isDev ? 'Development' : 'Production'}
API Base:    ${apiConfig.baseUrl || 'Not configured'}
`);
