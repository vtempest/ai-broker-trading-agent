# Deployment Checklist - Polymarket Cron Job

Quick reference for deploying the Polymarket data sync cron job to Vercel.

## Pre-Deployment

- [x] Created cron endpoint: `/app/api/cron/sync-markets/route.ts`
- [x] Created incremental sync function: `/packages/investing/src/prediction/sync/incremental-markets.ts`
- [x] Added exports to prediction index
- [x] Created `vercel.json` with cron configuration
- [x] Added documentation files
- [x] Build successful ✅

## Deployment Steps

### 1. Set Environment Variable in Vercel

```bash
# Generate a secure secret
openssl rand -base64 32

# Copy the output, then:
# 1. Go to Vercel Dashboard
# 2. Select your project
# 3. Go to Settings → Environment Variables
# 4. Add new variable:
#    Name: CRON_SECRET
#    Value: <paste the generated secret>
#    Environment: Production, Preview, Development
```

### 2. Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or push to main branch (if connected to git)
git add .
git commit -m "Add Polymarket cron job for automated data sync"
git push origin main
```

### 3. Verify Deployment

Check that the cron job is active:
1. Go to Vercel Dashboard
2. Navigate to: Project → Settings → Cron Jobs
3. Verify: `/api/cron/sync-markets` appears with schedule `*/15 * * * *`

### 4. Test the Endpoint

```bash
# Replace with your values
CRON_SECRET="your_secret_here"
DOMAIN="your-domain.vercel.app"

# Test the endpoint
curl -H "Authorization: Bearer $CRON_SECRET" \
     https://$DOMAIN/api/cron/sync-markets
```

Expected response:
```json
{
  "success": true,
  "markets": 1000,
  "pricePoints": 45000,
  "priceHistoryUpdates": 950,
  "holders": 12500,
  "holderUpdates": 980,
  "duration": "85.42s",
  "message": "Successfully synced...",
  "cronJob": true,
  "timestamp": "2026-01-24T12:00:00.000Z"
}
```

### 5. Monitor First Executions

Watch the logs for the first few cron executions:
```bash
vercel logs --follow
```

Or in Vercel Dashboard:
- Deployments → Latest → Functions → `/api/cron/sync-markets`

## Post-Deployment Verification

After 15 minutes (first cron execution):

- [ ] Check Vercel function logs for successful execution
- [ ] Verify database has updated market data
- [ ] Check that categories and subcategories are assigned
- [ ] Confirm price history is being synced
- [ ] No errors in execution logs

## Rollback Plan

If something goes wrong:

```bash
# Option 1: Disable cron by removing from vercel.json
# Edit vercel.json and remove the cron entry, then:
vercel --prod

# Option 2: Delete CRON_SECRET in Vercel Dashboard
# This will cause authentication to fail for automated runs
```

## Important Notes

- **Vercel Plan**: Requires Pro or Enterprise (cron not available on Hobby)
- **Execution Time**: Should complete in 30-60 seconds
- **Frequency**: Runs every 15 minutes (96 times/day)
- **Data Volume**: Syncs up to 1000 markets per run
- **Non-Destructive**: Updates existing data, doesn't delete

## Quick Reference

| Item | Value |
|------|-------|
| Endpoint | `/api/cron/sync-markets` |
| Schedule | Every 15 minutes |
| Max Markets | 1000 |
| Method | GET |
| Auth | Bearer token (CRON_SECRET) |
| Timeout | 300s (5 min) |

## Files Modified

- ✅ `vercel.json` - Cron configuration
- ✅ `.env` - Added CRON_SECRET placeholder
- ✅ `app/api/cron/sync-markets/route.ts` - Cron endpoint
- ✅ `packages/investing/src/prediction/sync/incremental-markets.ts` - Sync logic
- ✅ `packages/investing/src/prediction/index.ts` - Export statement

## Documentation

- [Full Setup Guide](CRON_SETUP.md)
- [Cron API Documentation](app/api/cron/README.md)
- [Vercel Cron Docs](https://vercel.com/docs/cron-jobs)
