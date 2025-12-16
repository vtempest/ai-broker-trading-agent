export declare function fetchMarkets(limit?: number, sortBy?: string): Promise<any>;
export declare function fetchLeaderboard(options?: {
    timePeriod?: 'all' | '1d' | '7d' | '30d';
    orderBy?: 'VOL' | 'PNL';
    limit?: number;
    offset?: number;
    category?: 'overall' | string;
}): Promise<any>;
export declare function fetchTopTraders(limit?: number): Promise<any>;
export declare function fetchTraderPositions(traderId: string): Promise<any>;
export declare function fetchMarketOrderBook(marketId: string): Promise<any>;
export declare function fetchMarketDetails(marketId: string): Promise<any>;
export declare function saveLeaders(leadersData: any[]): Promise<void>;
export declare function saveLeaderboardData(leaderboardData: any[]): Promise<void>;
export declare function savePositions(traderId: string, positionsData: any[]): Promise<void>;
export declare function saveCategories(categoriesData: any[]): Promise<void>;
export declare function saveMarkets(marketsData: any[]): Promise<void>;
export declare function saveMarketPositions(marketId: string, orderBookData: any): Promise<void>;
export declare function saveDebateAnalysis(marketId: string, debateData: {
    question: string;
    yesArguments: string[];
    noArguments: string[];
    yesSummary: string;
    noSummary: string;
    keyFactors: string[];
    uncertainties: string[];
    currentYesPrice: number;
    currentNoPrice: number;
    llmProvider?: string;
    model?: string;
}): Promise<void>;
export declare function getLeaders(orderBy?: 'vol' | 'pnl' | 'overallGain', limit?: number): Promise<{
    trader: string;
    rank: number | null;
    userName: string | null;
    xUsername: string | null;
    verifiedBadge: boolean | null;
    profileImage: string | null;
    vol: number | null;
    pnl: number | null;
    overallGain: number | null;
    winRate: number | null;
    activePositions: number | null;
    totalPositions: number | null;
    currentValue: number | null;
    winAmount: number | null;
    lossAmount: number | null;
    updatedAt: Date | null;
}[]>;
export declare function getTraderPositions(traderId: string): Promise<{
    id: string;
    traderId: string;
    marketId: string | null;
    marketTitle: string | null;
    cashPnl: number | null;
    realizedPnl: number | null;
    tags: string | null;
    createdAt: Date | null;
}[]>;
export declare function getCategories(): Promise<{
    best: {
        tag: string;
        pnl: number | null;
        updatedAt: Date | null;
    }[];
    worst: {
        tag: string;
        pnl: number | null;
        updatedAt: Date | null;
    }[];
}>;
export declare function getMarkets(options?: {
    limit?: number;
    sortBy?: 'volume24hr' | 'volumeTotal' | 'createdAt';
    category?: string;
    activeOnly?: boolean;
}): Promise<{
    id: string;
    question: string;
    slug: string;
    description: string | null;
    image: string | null;
    volume24hr: number | null;
    volumeTotal: number | null;
    active: boolean | null;
    closed: boolean | null;
    outcomes: string;
    outcomePrices: string;
    tags: string | null;
    endDate: string | null;
    groupItemTitle: string | null;
    enableOrderBook: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare function getMarketsByCategory(): Promise<Record<string, any[]>>;
export declare function getMarketPositions(marketId: string): Promise<{
    id: string;
    marketId: string;
    outcome: string;
    price: number;
    size: number;
    side: string;
    totalValue: number;
    createdAt: Date;
}[]>;
export declare function getMarketDebate(marketId: string): Promise<{
    id: string;
    marketId: string;
    question: string;
    yesArguments: string;
    noArguments: string;
    yesSummary: string;
    noSummary: string;
    keyFactors: string;
    uncertainties: string;
    currentYesPrice: number | null;
    currentNoPrice: number | null;
    llmProvider: string | null;
    model: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function analyzeCategories(allPositions: any[]): {
    best: {
        tag: any;
        pnl: any;
    }[];
    worst: {
        tag: any;
        pnl: any;
    }[];
};
export declare function syncMarkets(limit?: number): Promise<{
    markets: any;
}>;
export declare function syncLeaderboard(options?: {
    timePeriod?: 'all' | '1d' | '7d' | '30d';
    orderBy?: 'VOL' | 'PNL';
    limit?: number;
}): Promise<{
    leaders: any;
}>;
export declare function syncLeadersAndCategories(): Promise<{
    leaders: any;
    positions: number;
}>;
export declare function syncAll(): Promise<{
    markets: any;
    leaderboard: any;
    leaders: any;
    positions: number;
}>;
