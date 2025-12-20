import { NextRequest, NextResponse } from 'next/server'
import { syncCopyTradingLeadersOrders } from '@/lib/leaders/nvsty-leaders'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await syncCopyTradingLeadersOrders()
    return NextResponse.json({
      success: true,
      message: 'NVSTLY leaders and orders synced successfully'
    })
  } catch (error: any) {
    console.error('NVSTLY sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
