export interface HistoricalDataOptions {
    symbol: string;
    period1: string | Date;
    period2: string | Date;
    interval?: '1d' | '1wk' | '1mo' | '5m' | '15m' | '30m' | '1h';
}
export interface QuoteOptions {
    symbol: string;
    modules?: string[];
}
export declare class YFinanceWrapper {
    /**
     * Get historical price data for a symbol
     */
    getHistoricalData(options: HistoricalDataOptions): Promise<{
        success: boolean;
        symbol: string;
        data: import('yahoo-finance2/modules/chart').ChartResultArrayQuote[];
        meta: import('yahoo-finance2/modules/chart').ChartMeta;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        symbol?: undefined;
        data?: undefined;
        meta?: undefined;
    }>;
    /**
     * Get quote summary for a symbol
     */
    getQuote(options: QuoteOptions): Promise<{
        success: boolean;
        symbol: string;
        data: import('yahoo-finance2/modules/quoteSummary-iface').QuoteSummaryResult;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        symbol?: undefined;
        data?: undefined;
    }>;
    /**
     * Search for stocks by query
     */
    search(query: string): Promise<{
        success: boolean;
        query: string;
        results: (import('yahoo-finance2/modules/search').SearchQuoteYahooEquity | import('yahoo-finance2/modules/search').SearchQuoteYahooOption | import('yahoo-finance2/modules/search').SearchQuoteYahooETF | import('yahoo-finance2/modules/search').SearchQuoteYahooFund | import('yahoo-finance2/modules/search').SearchQuoteYahooIndex | import('yahoo-finance2/modules/search').SearchQuoteYahooCurrency | import('yahoo-finance2/modules/search').SearchQuoteYahooCryptocurrency | import('yahoo-finance2/modules/search').SearchQuoteNonYahoo | import('yahoo-finance2/modules/search').SearchQuoteYahooFuture | import('yahoo-finance2/modules/search').SearchQuoteYahooMoneyMarket)[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        query?: undefined;
        results?: undefined;
    }>;
    /**
     * Get options data for a symbol
     */
    getOptions(symbol: string, date?: Date): Promise<{
        success: boolean;
        symbol: string;
        data: import('yahoo-finance2/modules/options').OptionsResult;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        symbol?: undefined;
        data?: undefined;
    }>;
    /**
     * Get trending stocks
     */
    getTrending(region?: string): Promise<{
        success: boolean;
        region: string;
        data: import('yahoo-finance2/modules/trendingSymbols').TrendingSymbolsResult;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        region?: undefined;
        data?: undefined;
    }>;
    /**
     * Get recommendations for a symbol
     */
    getRecommendations(symbol: string): Promise<{
        success: boolean;
        symbol: string;
        data: import('yahoo-finance2/modules/quoteSummary-iface').QuoteSummaryResult;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        symbol?: undefined;
        data?: undefined;
    }>;
    /**
     * Get financial statements for a symbol
     */
    getFinancials(symbol: string): Promise<{
        success: boolean;
        symbol: string;
        data: import('yahoo-finance2/modules/quoteSummary-iface').QuoteSummaryResult;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        symbol?: undefined;
        data?: undefined;
    }>;
}
export declare const yfinance: YFinanceWrapper;
