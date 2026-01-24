# Polymarket Data Sync - Vercel Cron Job Setup

This document explains the automated Polymarket market data synchronization system.

## Overview

A Vercel cron job runs every 15 minutes to keep the database synchronized with the latest Polymarket prediction market data. This ensures users always have access to up-to-date market information, prices, and categories.

## What Gets Synced

Every 15 minutes, the system:

1. **Fetches Top 1000 Markets** - Gets the highest volume active markets from Polymarket
2. **Updates Market Data** - Upserts market information (question, slug, volume, status, etc.)
3. **Categorizes Markets** - Automatically assigns categories and subcategories:
   - **Categories**: Politics, Sports, Crypto, Culture, Weather, Economics, Tech, Finance, Overall
   - **Subcategories**: Elections, Presidency, Football, Bitcoin, AI, etc. (60+ subcategories)
4. **Syncs Price History** - Fetches hourly price data for each market (batches of 50)
5. **Syncs Top Holders** - Fetches top holders/positions for each market (batches of 20)
6. **Processes in Batches** - Handles API calls in batches to avoid rate limits

## Key Features

### Incremental Sync
- **Non-destructive**: Updates existing markets without deleting all data
- **Continuous availability**: No downtime for users during sync
- **Smart upserts**: Updates changed data, keeps unchanged data intact

### Error Resilience
- Individual market failures don't stop the entire sync
- Validates token IDs before fetching price history
- Gracefully handles API rate limits and errors
- Comprehensive logging for monitoring

### Automatic Categorization
Markets are intelligently categorized using keyword matching:
- Primary category based on tags and question text
- Subcategory assigned with confidence scoring
- Example: "Will Trump win the 2024 election?" → Politics → Elections

### Top Holders Tracking
- Fetches top holders for each market from Polymarket Analytics
- Stores holder addresses, balances, and positions
- Updates rankings and USD values
- Enables whale tracking and social sentiment analysis

## Files Created/Modified

### New Files

1. **[/app/api/cron/sync-markets/route.ts](app/api/cron/sync-markets/route.ts)**
   - Cron endpoint that Vercel calls every 15 minutes
   - Authenticates requests using CRON_SECRET
   - Calls the incremental sync function

2. **[/packages/investing/src/prediction/sync/incremental-markets.ts](packages/investing/src/prediction/sync/incremental-markets.ts)**
   - Core sync logic using upserts instead of deletes
   - Batch processing for price history
   - Error handling and progress logging

3. **[/vercel.json](vercel.json)**
   - Vercel configuration for cron jobs
   - Schedule: `*/15 * * * *` (every 15 minutes)

4. **[/app/api/cron/README.md](app/api/cron/README.md)**
   - Comprehensive documentation for all cron jobs
   - Setup instructions, testing guide, monitoring tips

5. **[/CRON_SETUP.md](CRON_SETUP.md)** (this file)
   - Overview and implementation details

### Modified Files

1. **[/packages/investing/src/prediction/index.ts](packages/investing/src/prediction/index.ts)**
   - Added export for `syncMarketsIncremental`

2. **[/.env](/.env)**
   - Added `CRON_SECRET` environment variable

## Setup Instructions

### 1. Environment Variables

Add to your Vercel project settings (Settings → Environment Variables):

```bash
CRON_SECRET=<generate_random_string>
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2. Deploy to Vercel

The cron job will automatically activate when deployed to Vercel:

```bash
vercel --prod
```

### 3. Verify Setup

Check that the cron job is registered:
- Go to Vercel Dashboard → Project → Settings → Cron Jobs
- You should see: `/api/cron/sync-markets` with schedule `*/15 * * * *`

### 4. Monitor Logs

View cron execution logs:
```bash
vercel logs --follow
```

Or in the Vercel Dashboard:
- Deployments → Select deployment → Functions → `/api/cron/sync-markets`

## Testing

### Local Testing

```bash
# Start development server
npm run dev

# In another terminal, trigger the cron job manually
curl -H "Authorization: Bearer your_cron_secret_here" http://localhost:3000/api/cron/sync-markets
```

### Production Testing

```bash
curl -H "Authorization: Bearer your_cron_secret_here" https://your-domain.com/api/cron/sync-markets
```

## Expected Response

Success response:
```json
{
  "success": true,
  "markets": 1000,
  "pricePoints": 45000,
  "priceHistoryUpdates": 950,
  "holders": 12500,
  "holderUpdates": 980,
  "duration": "85.42s",
  "message": "Successfully synced 1000 markets with 45000 price data points (950 markets updated) and 12500 holders (980 markets updated) in 85.42s",
  "cronJob": true,
  "timestamp": "2026-01-24T12:00:00.000Z"
}
```

Error response:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "cronJob": true,
  "timestamp": "2026-01-24T12:00:00.000Z"
}
```

## Performance

- **Average execution time**: 60-120 seconds (includes holder data)
- **Markets synced**: Up to 1000 per run
- **Price history points**: ~45,000 per run (1000 markets × ~45 hourly data points)
- **Holders synced**: ~10,000-15,000 per run (980+ markets × ~10-15 holders each)
- **Frequency**: Every 15 minutes = 96 times per day
- **Daily data points**: ~4.3 million price updates + ~1.2 million holder updates per day
- **Batch sizes**:
  - Price history: 50 markets per batch
  - Holders: 20 markets per batch (with 2s delay between batches)

## Vercel Plan Requirements

- **Free/Hobby**: ❌ Cron jobs not available
- **Pro**: ✅ Up to 2 cron jobs (this uses 1)
- **Enterprise**: ✅ Unlimited cron jobs

## Limitations

- **Max execution time**: 300 seconds (5 minutes) on Pro plan
- **Concurrent executions**: Vercel prevents overlapping cron runs
- **Rate limits**: Respects Polymarket API rate limits through batch processing

## Troubleshooting

### Cron job not running

1. Check CRON_SECRET is set in Vercel environment variables
2. Verify vercel.json is deployed (check in deployment logs)
3. Ensure project is on Pro or Enterprise plan
4. Check function logs for errors

### Sync failures

1. **Token validation errors**: Normal, some markets have invalid token IDs
2. **Rate limit errors**: Increase batch delay or reduce batch size
3. **Timeout errors**: Reduce maxMarkets from 1000 to 500

### Missing data

1. Check if markets are being filtered by volume correctly
2. Verify database connection (DATABASE_URL)
3. Check if price history API is responding

## Monitoring Checklist

Weekly checks:
- [ ] Review error logs for patterns
- [ ] Verify data freshness (check updatedAt timestamps)
- [ ] Monitor execution duration (should be < 2 minutes)
- [ ] Check success rate (should be > 95%)

## Security

- **CRON_SECRET**: Never commit to version control
- **Rotate regularly**: Change CRON_SECRET every 3-6 months
- **Restricted access**: Only Vercel cron service should have the secret
- **Monitoring**: Log all cron job executions

## Future Improvements

Potential enhancements:
- [ ] Add retry logic for failed price history fetches
- [ ] Implement progressive backoff for rate limits
- [ ] Add metrics tracking (success rate, avg duration)
- [ ] Create alerting for consecutive failures
- [ ] Add market deactivation detection
- [ ] Sync holder data alongside price history

## Related Documentation

- [Cron Jobs Documentation](app/api/cron/README.md)
- [Vercel Cron Jobs Docs](https://vercel.com/docs/cron-jobs)
- [Polymarket API Docs](https://docs.polymarket.com)

## Support

For issues or questions:
1. Check the logs in Vercel Dashboard
2. Review error messages in function output
3. Test locally with curl commands
4. Check Polymarket API status
