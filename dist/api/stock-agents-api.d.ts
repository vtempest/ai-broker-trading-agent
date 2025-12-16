/**
 * Stock Prediction Agents API Client
 * Connects to unified API gateway and individual agent services
 */
export declare const TOP_STOCKS: {
    sp500Top: string[];
    tech: string[];
    faang: string[];
    mag7: string[];
    mostActive: string[];
};
export interface NewsResearcherAnalysisRequest {
    symbols: string[];
    date?: string;
}
export interface NewsResearcherAnalysisResponse {
    success: boolean;
    symbols: string[];
    date: string;
    result: {
        data_collection_results?: any;
        technical_analysis_results?: any;
        news_intelligence_results?: any;
        portfolio_manager_results?: {
            decision: 'BUY' | 'SELL' | 'HOLD';
            confidence: number;
            reasoning: string;
        };
    };
    timestamp: string;
}
export interface DebateAnalystAnalysisRequest {
    symbol: string;
    date?: string;
    deep_think_llm?: string;
    quick_think_llm?: string;
    max_debate_rounds?: number;
}
export interface DebateAnalystAnalysisResponse {
    success: boolean;
    symbol: string;
    date: string;
    decision: {
        action: 'BUY' | 'SELL' | 'HOLD';
        confidence: number;
        position_size: number;
        reasoning: string;
        debate_summary?: {
            bull_arguments: string[];
            bear_arguments: string[];
            risk_assessment: string;
        };
    };
    timestamp: string;
}
export interface BacktestRequest {
    symbol: string;
    data_dir?: string;
    printlog?: boolean;
}
export interface BacktestResponse {
    success: boolean;
    symbol: string;
    primo_results: {
        'Starting Portfolio Value [$]': number;
        'Final Portfolio Value [$]': number;
        'Cumulative Return [%]': number;
        'Annual Return [%]': number;
        'Annual Volatility [%]': number;
        'Sharpe Ratio': number;
        'Max Drawdown [%]': number;
        'Total Trades': number;
        'Win Rate [%]': number;
    };
    buyhold_results: any;
    comparison: {
        relative_return: number;
        outperformed: boolean;
        metrics: {
            cumulative_return_diff: number;
            volatility_diff: number;
            max_drawdown_diff: number;
            sharpe_diff: number;
        };
    };
    timestamp: string;
}
export interface BatchAnalysisRequest {
    symbols: string[];
    start_date: string;
    end_date: string;
}
export declare class StockAgentsAPI {
    private baseURL;
    constructor(baseURL?: string);
    private fetchAPI;
    getHealth(): Promise<any>;
    getAgentLogs(limit?: number): Promise<any[]>;
    analyzeWithNewsResearcher(request: NewsResearcherAnalysisRequest): Promise<NewsResearcherAnalysisResponse>;
    batchAnalyzeWithNewsResearcher(request: BatchAnalysisRequest): Promise<void>;
    analyzeWithDebateAnalyst(request: DebateAnalystAnalysisRequest): Promise<DebateAnalystAnalysisResponse>;
    reflectOnTrade(positionReturns: number): Promise<{
        success: boolean;
    }>;
    getDebateAnalystConfig(): Promise<{
        success: boolean;
    }>;
    runBacktest(request: BacktestRequest): Promise<BacktestResponse>;
    getAvailableStocks(dataDir?: string): Promise<{
        success: boolean;
        files: never[];
    }>;
    analyzeTopStocks(stockList?: keyof typeof TOP_STOCKS, agent?: 'news-researcher' | 'debate-analyst'): Promise<PromiseSettledResult<NewsResearcherAnalysisResponse>[] | PromiseSettledResult<DebateAnalystAnalysisResponse>[]>;
    batchBacktest(symbols: string[]): Promise<PromiseSettledResult<BacktestResponse>[]>;
}
export declare const stockAgentsAPI: StockAgentsAPI;
export declare function analyzeStock(symbol: string, agent?: 'news-researcher' | 'debate-analyst'): Promise<NewsResearcherAnalysisResponse | DebateAnalystAnalysisResponse>;
export declare function analyzeTopStocks(list?: keyof typeof TOP_STOCKS, agent?: 'news-researcher' | 'debate-analyst'): Promise<PromiseSettledResult<NewsResearcherAnalysisResponse>[] | PromiseSettledResult<DebateAnalystAnalysisResponse>[]>;
export declare function backtestStock(symbol: string): Promise<BacktestResponse>;
export declare function getServiceHealth(): Promise<any>;
export declare const queryKeys: {
    health: readonly ["health"];
    newsResearcher: (symbols: string[]) => readonly ["news-researcher", ...string[]];
    debateAnalyst: (symbol: string) => readonly ["debate-analyst", string];
    backtest: (symbol: string) => readonly ["backtest", string];
    availableStocks: readonly ["available-stocks"];
    topStocks: (list: string, agent: string) => readonly ["top-stocks", string, string];
};
