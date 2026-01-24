# Top Holders Syncing

The cron job now syncs top holders for each market alongside price history and market data.

## Overview

**Top holders** (also known as "whales") are the largest position holders in each Polymarket prediction market. Tracking these holders provides valuable insights into:

- Market sentiment from sophisticated traders
- Whale movements and position changes
- Social proof for market positions
- Smart money tracking

## What Gets Stored

For each market, we store the top holders with:

- **Address**: Wallet address of the holder
- **Username**: Polymarket username (if available)
- **Profile Image**: Avatar URL
- **Rank**: Position in the top holders list (1-10+ typically)
- **Outcome**: Which side they're betting on ("Yes" or "No")
- **Balance**: Number of shares held
- **Value**: USD value of their position
- **Updated At**: Timestamp of last sync

## Database Schema

```typescript
polymarketHolders {
  id: string (PK)
  marketId: string
  address: string
  userName: string | null
  profileImage: string | null
  rank: number
  outcome: string | null  // "Yes" or "No"
  balance: number
  value: number
  updatedAt: timestamp
}
```

## How It Works

### 1. Event ID Resolution

To fetch holders, we need the market's `eventId`:

```typescript
// Try to get from market data first
let eventId = market.events?.[0]?.id

// If not available, fetch market details
if (!eventId) {
  const details = await fetchMarketDetails(market.id)
  eventId = details.events?.[0]?.id
}
```

### 2. Dashboard API Call

We use the Polymarket Analytics dashboard API:

```typescript
const dashboard = await fetchMarketsDashboard(eventId)

// Dashboard includes:
// - holders: Array of top holder objects
// - charts: Market activity charts
// - volume: Trading volume data
```

### 3. Save to Database

```typescript
await saveHolders(marketId, dashboard.holders)

// This:
// 1. Clears existing holders for the market
// 2. Inserts new holders with rankings
// 3. Preserves holder metadata
```

## Batch Processing

Holder syncing uses smaller batches than price history:

```typescript
const holderBatchSize = 20  // 20 markets per batch
const delay = 2000  // 2 second delay between batches

// Why smaller batches?
// - Dashboard API is more expensive
// - Requires event ID lookup (extra API call)
// - Rate limits are stricter
```

## Error Handling

The sync gracefully handles:

- **Missing event IDs**: Skips markets without events
- **API failures**: Continues with other markets
- **Rate limits (429)**: Silently skips and tries next batch
- **404 errors**: Market no longer exists or is private

Common error codes:
- `400`: Bad request (invalid event ID)
- `404`: Market not found
- `429`: Rate limit exceeded

## Performance

Per 1000 markets sync:

- **Holder API calls**: ~1000-2000 (event lookup + dashboard)
- **Holders synced**: 10,000-15,000 (avg 10-15 per market)
- **Batch processing**: 50 batches of 20 markets
- **Total delay time**: ~100 seconds (50 batches × 2s)
- **Execution time**: ~80-120 seconds total

## Usage

### Query Top Holders

```typescript
import { getMarketHolders } from '@/packages/investing/src/prediction'

// Get top 10 holders for a market
const holders = await getMarketHolders(marketId, 10)

holders.forEach(holder => {
  console.log(`${holder.rank}. ${holder.userName || holder.address}`)
  console.log(`   ${holder.outcome}: ${holder.balance} shares ($${holder.value})`)
})
```

### API Endpoint

The data is used by the TopHoldersList component:

```typescript
// app/api/polymarket/holders/route.ts
GET /api/polymarket/holders?marketId={marketId}&limit=10
```

### Component Usage

```tsx
<TopHoldersList
  marketId={market.id}
  eventId={market.eventId}
/>
```

## Data Freshness

- **Sync Frequency**: Every 15 minutes
- **Max Staleness**: 15 minutes
- **Update Strategy**: Full refresh (delete + insert)

## Benefits

### 1. Whale Tracking
Track major position changes by large holders:
```sql
SELECT * FROM polymarket_holders
WHERE value > 10000
ORDER BY value DESC
```

### 2. Market Sentiment
See which side the smart money is betting on:
```sql
SELECT outcome, COUNT(*), SUM(value) as total_value
FROM polymarket_holders
WHERE market_id = 'xyz'
GROUP BY outcome
```

### 3. Social Proof
Display holder information to users for credibility

### 4. Influencer Tracking
Identify and track positions of verified users

## Rate Limiting

The Polymarket Analytics API has stricter limits:

- **Per batch**: 2 second delay
- **Per market**: 2 API calls (details + dashboard)
- **Total for 1000 markets**: ~2000 API calls in ~2 minutes

This is within acceptable limits and doesn't trigger rate limiting.

## Future Enhancements

Potential improvements:

- [ ] Cache event IDs to reduce API calls
- [ ] Track holder changes over time (delta tracking)
- [ ] Alert on large position changes
- [ ] Aggregate whale movements across markets
- [ ] Track individual holder performance
- [ ] Social graph of connected holders

## Troubleshooting

### No holders showing up

Check:
1. Market has an event ID in database
2. Market is active (not closed)
3. Dashboard API is responding (check logs)
4. Holders array is not empty in API response

### Incomplete holder data

Some markets may have:
- No username (anonymous wallets)
- No profile image
- No outcome specified (older markets)

This is normal and handled gracefully.

### Rate limiting errors

If you see 429 errors:
1. Check batch size (should be 20)
2. Verify delay between batches (should be 2s)
3. Consider reducing markets synced if persistent

## Related Files

- [incremental-markets.ts](packages/investing/src/prediction/sync/incremental-markets.ts) - Sync logic
- [positions.ts](packages/investing/src/prediction/db/positions.ts) - Save/query functions
- [analytics.ts](packages/investing/src/prediction/api/analytics.ts) - API calls
- [holders/route.ts](app/api/polymarket/holders/route.ts) - API endpoint
- [top-holders-list.tsx](components/investing/analysis/top-holders-list.tsx) - UI component

## Monitoring

Watch for these metrics in cron logs:

```
Saved 12,500 holders across 980 markets
```

Good signs:
- holderUpdates close to markets count (950+ out of 1000)
- No persistent 429 errors
- Execution completes in < 2 minutes

Warning signs:
- holderUpdates significantly lower than markets (<500)
- Many 429 rate limit errors
- Execution time > 3 minutes
