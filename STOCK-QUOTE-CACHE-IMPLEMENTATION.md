# Stock Quote Cache Implementation

## Overview

Implemented a comprehensive caching system for stock quotes to reduce API calls and improve performance. The system stores fetched quotes in the database and checks cache before making external API requests.

## Database Schema

Added three new tables to cache stock data:

### 1. Stock Quote Cache (`stock_quote_cache`)
Stores real-time quote data with 1-minute TTL:
- `symbol` (PRIMARY KEY)
- `price`, `change`, `changePercent`
- `open`, `high`, `low`, `previousClose`, `volume`
- `marketCap`, `currency`, `name`, `exchange`
- `source` (yfinance/finnhub/alpaca)
- `lastFetched`, `createdAt`, `updatedAt`

### 2. Stock Fundamentals (`stock_fundamentals`)
Stores fundamental data with 24-hour TTL:
- `symbol` (PRIMARY KEY)
- `peRatio`, `eps`, `dividendYield`, `beta`
- `fiftyTwoWeekHigh`, `fiftyTwoWeekLow`
- `fiftyDayAverage`, `twoHundredDayAverage`
- `sharesOutstanding`, `bookValue`, `priceToBook`
- `trailingPE`, `forwardPE`
- `lastFetched`, `createdAt`, `updatedAt`

### 3. Historical Quote Data (`stock_historical_quotes`)
Stores daily historical quotes:
- `id` (PRIMARY KEY)
- `symbol`, `date` (YYYY-MM-DD)
- `open`, `high`, `low`, `close`
- `volume`, `adjustedClose`
- `createdAt`

## Implementation Details

### Quote Cache Service
**File:** [packages/investing/src/stocks/quote-cache-service.ts](packages/investing/src/stocks/quote-cache-service.ts)

Features:
- `getCachedQuote(symbol)` - Retrieve cached quote with TTL check
- `saveQuoteToCache(quote)` - Save quote to cache
- `saveHistoricalQuotes(symbol, quotes)` - Save historical data
- `getCachedHistoricalQuotes(symbol, startDate?, endDate?)` - Retrieve historical data
- `saveFundamentals(symbol, fundamentals)` - Save fundamental data
- `getCachedFundamentals(symbol)` - Retrieve fundamental data

TTL Configuration:
- Quote Cache: 1 minute
- Fundamentals: 24 hours
- Historical Data: 30 days (permanent storage)

### Unified Quote Service
**File:** [packages/investing/src/stocks/unified-quote-service.ts](packages/investing/src/stocks/unified-quote-service.ts)

Updated priority order to avoid yfinance IP blocking:
1. **Cache** - Check database cache first
2. **Finnhub** - Primary external source
3. **Alpaca** - Secondary fallback
4. **YFinance** - Last resort (to avoid IP blocking)

Changes:
- Added cache check before making external API calls
- Save all fetched quotes to cache automatically
- Changed from batch requests to individual requests to avoid yfinance rate limits
- All sources now save to cache on successful fetch

### API Route
**File:** [app/api/stocks/quotes/route.ts](app/api/stocks/quotes/route.ts)

Enhanced to cache historical data:
- `getMonthlyChange()` now saves 30-day historical data to cache
- `getYearlyChange()` now saves 1-year historical data to cache
- Automatically uses unified-quote-service caching

## Usage

The caching is transparent and automatic:

```typescript
import { getQuote, getQuotes } from '@/packages/investing/src/stocks/unified-quote-service';

// Single quote - checks cache first
const quote = await getQuote('AAPL');

// Multiple quotes - checks cache for each symbol first
const quotes = await getQuotes(['AAPL', 'MSFT', 'GOOGL']);
```

## Benefits

1. **Reduced API Calls** - Cache hits avoid external API requests
2. **Faster Response Times** - Database lookups are faster than API calls
3. **IP Blocking Prevention** - Finnhub prioritized over yfinance
4. **Historical Data Storage** - Daily quotes stored for analytics
5. **Fundamentals Tracking** - PE ratios and other metrics cached
6. **Automatic Cache Management** - TTL-based expiration

## Database Migration

Migration file: `migrations/0008_slim_mauler.sql`

Tables created:
- `stock_quote_cache`
- `stock_fundamentals`
- `stock_historical_quotes`

To apply migration:
```bash
npx drizzle-kit push
```

## Notes

- Cache TTL can be adjusted in [quote-cache-service.ts](packages/investing/src/stocks/quote-cache-service.ts:21-23)
- Quote cache expires after 1 minute to ensure fresh market data
- Fundamentals cache expires after 24 hours (less volatile)
- Historical quotes are permanent (append-only)
- Error handling includes graceful fallbacks if cache fails
- All cache operations are async and non-blocking
