// Stock Quote API Route - Using Unified Quote Service
import { NextRequest, NextResponse } from "next/server";
import { getQuote } from "@/packages/investing/src/stocks/unified-quote-service";
import { finnhub } from "@/packages/investing/src/stocks/finnhub-wrapper";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  try {
    const { symbol } = await params;
    const searchParams = request.nextUrl.searchParams;
    const liveParam = searchParams.get("live");
    const useCache = liveParam !== "true"; // Use cache by default, bypass if live=true

    // Fetch quote data using unified service (with cache support)
    const quoteResult = await getQuote(symbol, { useCache });

    if (!quoteResult.success || !quoteResult.data) {
      return NextResponse.json(
        {
          success: false,
          error: quoteResult.error || "Failed to fetch quote",
          code: "QUOTE_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    const quote = quoteResult.data;

    // Fetch peers/related stocks
    let peers: string[] = [];
    try {
      const peersResult = await finnhub.getPeers(symbol);
      if (peersResult.success && peersResult.peers) {
        peers = peersResult.peers.filter((p: string) => p !== symbol);
      }
    } catch (e) {
      console.warn(`Failed to fetch peers for ${symbol}`, e);
    }

    return NextResponse.json({
      success: true,
      symbol,
      data: {
        price: {
          regularMarketPrice: quote.price,
          regularMarketChange: quote.change,
          regularMarketChangePercent: quote.changePercent,
          regularMarketTime: quote.timestamp,
          marketCap: quote.marketCap,
          currency: quote.currency,
          longName: quote.name,
          shortName: quote.name,
          exchange: quote.exchange,
        },
        summaryDetail: {
          open: quote.open,
          dayHigh: quote.high,
          dayLow: quote.low,
          previousClose: quote.previousClose,
          regularMarketVolume: quote.volume,
        },
        peers,
      },
      source: quote.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch quote",
        code: "QUOTE_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
