import fetch from "node-fetch";
import type { PolymarketCategory } from "../constants";

/**
 * Fetches the Polymarket leaderboard with top traders ranked by volume or PnL.
 * @param options - Configuration options for the leaderboard query
 * @param options.timePeriod - Time period filter: "all", "1d", "7d", or "30d" (default: "all")
 * @param options.orderBy - Sort order: "VOL" for volume or "PNL" for profit/loss (default: "VOL")
 * @param options.limit - Maximum number of entries to retrieve (default: 20)
 * @param options.offset - Number of entries to skip for pagination (default: 0)
 * @param options.category - Category filter (default: "overall")
 * @returns Array of leaderboard entries
 * @throws Error if the API request fails
 */
export async function fetchLeaderboard(
  options: {
    timePeriod?: "all" | "1d" | "7d" | "30d";
    orderBy?: "VOL" | "PNL";
    limit?: number;
    offset?: number;
    category?: PolymarketCategory | Lowercase<PolymarketCategory>;
  } = {},
) {
  const {
    timePeriod = "all",
    orderBy = "VOL",
    limit = 20,
    offset = 0,
    category = "Overall",
  } = options;

  const url = new URL("https://data-api.polymarket.com/v1/leaderboard");
  url.searchParams.set("timePeriod", timePeriod);
  url.searchParams.set("orderBy", orderBy);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("category", category);

  const resp = await fetch(url, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  if (!resp.ok) throw new Error(`leaderboard fetch failed: ${resp.status}`);
  return await resp.json();
}

/**
 * Fetches top traders from Polymarket Analytics API sorted by overall gain.
 * @param limit - Maximum number of traders to retrieve (default: 50)
 * @returns Array of trader objects with performance metrics
 * @throws Error if the API request fails
 */
export async function fetchTopTraders(limit = 50) {
  const resp = await fetch(
    "https://polymarketanalytics.com/api/traders-tag-performance",
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        tag: "Overall",
        sortColumn: "overall_gain",
        sortDirection: "DESC",
        minPnL: -4534159.552280787,
        maxPnL: 3203232.91229432,
        minActivePositions: 0,
        maxActivePositions: 38642,
        minWinAmount: 0,
        maxWinAmount: 20316723.043360095,
        minLossAmount: -20494980.369057264,
        maxLossAmount: 0,
        minWinRate: 0,
        maxWinRate: 100,
        minCurrentValue: 0,
        maxCurrentValue: 1000000000000,
        minTotalPositions: 1,
        maxTotalPositions: 56928,
      }),
    },
  );

  if (!resp.ok) throw new Error(`leaders fetch failed: ${resp.status}`);
  const data = await resp.json();

  // Handle both array (direct) and object { data: [...] } formats
  let traders = [];
  if (Array.isArray(data)) {
    traders = data;
  } else {
    console.error("Polymarket API returned non-array:", JSON.stringify(data));
    return [];
  }

  return traders.slice(0, limit);
}

/**
 * Fetches all positions for a specific trader from Polymarket Analytics API.
 * @param traderId - The unique identifier of the trader
 * @returns Array of position objects for the trader
 * @throws Error if the API request fails
 */
export async function fetchTraderPositions(traderId: string) {
  const resp = await fetch(
    "https://polymarketanalytics.com/api/traders-positions",
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({ trader_id: traderId }),
    },
  );

  if (!resp.ok) throw new Error(`positions fetch failed: ${resp.status}`);
  return await resp.json();
}

export interface TraderProfile {
  address: string;
  userName?: string;
  profileImage?: string;
  overallGain: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  totalPositions: number;
  activePositions: number;
  currentValue: number;
}

/**
 * Fetches profile stats for multiple traders from Polymarket Analytics API.
 * Uses the traders-tag-performance API to get bulk trader data.
 * @param addresses - Array of trader wallet addresses
 * @returns Map of address to trader profile data
 */
export async function fetchTraderProfiles(
  addresses: string[],
): Promise<Map<string, TraderProfile>> {
  const profileMap = new Map<string, TraderProfile>();

  if (addresses.length === 0) {
    return profileMap;
  }

  try {
    // Fetch top traders which includes performance data
    const resp = await fetch(
      "https://polymarketanalytics.com/api/traders-tag-performance",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          tag: "Overall",
          sortColumn: "overall_gain",
          sortDirection: "DESC",
          minPnL: -100000000,
          maxPnL: 100000000,
          minActivePositions: 0,
          maxActivePositions: 100000,
          minWinAmount: 0,
          maxWinAmount: 100000000,
          minLossAmount: -100000000,
          maxLossAmount: 0,
          minWinRate: 0,
          maxWinRate: 100,
          minCurrentValue: 0,
          maxCurrentValue: 100000000000,
          minTotalPositions: 0,
          maxTotalPositions: 100000,
        }),
      },
    );

    if (!resp.ok) {
      console.error(`Trader profiles fetch failed: ${resp.status}`);
      return profileMap;
    }

    const data = await resp.json();
    const traders = Array.isArray(data) ? data : [];

    // Create a lookup set for efficient address matching
    const addressSet = new Set(addresses.map((a) => a.toLowerCase()));

    for (const trader of traders) {
      const traderAddress =
        trader.proxy_wallet || trader.proxyWallet || trader.address || "";
      if (addressSet.has(traderAddress.toLowerCase())) {
        profileMap.set(traderAddress.toLowerCase(), {
          address: traderAddress,
          userName: trader.user_name || trader.userName,
          profileImage: trader.profile_image || trader.profileImage,
          overallGain: trader.overall_gain || trader.overallGain || 0,
          winRate: trader.win_rate || trader.winRate || 0,
          totalProfit: trader.win_amount || trader.winAmount || 0,
          totalLoss: trader.loss_amount || trader.lossAmount || 0,
          totalPositions: trader.total_positions || trader.totalPositions || 0,
          activePositions:
            trader.active_positions || trader.activePositions || 0,
          currentValue: trader.current_value || trader.currentValue || 0,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching trader profiles:", error);
  }

  return profileMap;
}
