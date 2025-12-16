interface Trader {
    /** The unique identifier of the trader. */
    id: string;
    /** The name of the trader. */
    name: string;
    /** The rank of the trader among others. */
    rank: number;
    /** The reputation score of the trader. */
    rep: number;
    /** The total number of trades executed by the trader. */
    trades: number;
    /** The win rate percentage of the trader. */
    winRate: number;
    /** The total gain accumulated by the trader. */
    totalGain: number;
    /** The average return per trade for the trader. */
    avgReturn: number;
    /** An array of trades associated with the trader. */
    orders: Trade[];
    /** The broker associated with the trader. */
    broker: string;
}
interface Trade {
    /** The stock symbol of the trade. */
    symbol: string;
    /** The type of trade: 'buy', 'sell', or 'short'. */
    type: "buy" | "sell" | "short";
    /** The price at which the trade was executed. */
    price: number;
    /** The timestamp of the trade in ISO 8601 format. */
    time: string;
    /** The profit on close in percentage, if the trade is closed. */
    gain?: number;
    /** The previous price on open, relevant for closed or short trades. */
    previousPrice?: number;
}
/**
 * NVSTLY API client for fetching trader rankings and trades.
 */
declare class LeadersAPI {
    api: any;
    constructor();
    /**
     * Fetches trader rankings from the NVSTLY API.
     *
     * @param {string} [time='1mo'] - The time frame for the rankings (e.g., '1mo', '3mo', '1y').
     * @returns {Promise<Trader[]>} A promise that resolves to the trader rankings data.
     */
    getTraderRankings: (time?: string) => Promise<Trader[]>;
    /**
     * Fetches trader order flow from the NVSTLY API.
     *
     * @param {string} traderId - The ID of the trader to fetch trades for.
     * @param {string} [time='1mo'] - The time frame for the trades (e.g., '1mo', '3mo', '1y').
     * @returns {Promise<Trade[]>} A promise that resolves to the trader rankings data.
     */
    getTraderTrades: (traderId: string, time?: string) => Promise<Trade[]>;
}
export declare const myLeadersAPI: LeadersAPI;
export {};
