export interface PortfolioSummary {
    totalEquity: number;
    dailyPnL: number;
    dailyPnLPercent: number;
    winRate: number;
    openPositions: number;
    cash: number;
    margin: number;
    stocks: number;
    predictionMarkets: number;
}
export interface Strategy {
    id: string;
    name: string;
    description: string;
    todayPnL: number;
    last7DaysPnL: number;
    last30DaysPnL: number;
    winRate: number;
    activeMarkets: number;
    tradesToday: number;
    status: 'running' | 'paused' | 'paper';
    timeframe: string;
    riskLevel: 'low' | 'medium' | 'high';
    bestConditions: string;
    avoidWhen: string;
    likes?: number;
    source?: string;
    author?: string;
    created?: string;
    updated?: string;
    script_type?: string;
}
export interface Signal {
    id: string;
    asset: string;
    type: 'stock' | 'prediction_market';
    combinedScore: number;
    scoreLabel: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
    drivers: {
        fundamentals: number;
        vix: number;
        technical: number;
        sentiment: number;
    };
    timeframe: 'intraday' | 'daily' | 'event';
    strategy: string;
    suggestedAction: string;
    suggestedSize: string;
    peRatio?: number;
    peClassification?: string;
    vixRegime?: string;
    rsi?: number;
    macd?: number;
    sentimentScore?: number;
    agentCommentary?: string[];
}
export interface Agent {
    id: string;
    name: string;
    type: 'analyst' | 'researcher' | 'trader' | 'risk' | 'pm';
    queueLength: number;
    avgLatency: number;
    errorRate: number;
    recentActivity?: string[];
}
export interface PredictionMarket {
    id: string;
    platform: 'Polymarket' | 'Kalshi';
    eventName: string;
    currentOdds: number;
    volume: number;
    liquidity: number;
    expectedEdge: number;
    llmProbability: number;
    category: 'politics' | 'macro' | 'tech' | 'sports';
    timeToResolution: string;
    llmAnalysis: string;
    correlatedTickers?: string[];
}
export interface TopTrader {
    id: string;
    name: string;
    rank: number;
    overallPnL: number;
    winRate: number;
    activePositions: number;
    currentValue: number;
    avgHoldingPeriod: string;
    maxDrawdown: number;
    volatility: number;
    markets: string[];
}
export interface Position {
    id: string;
    asset: string;
    type: 'stock' | 'prediction_market';
    entryPrice: number;
    currentPrice: number;
    size: number;
    unrealizedPnL: number;
    unrealizedPnLPercent: number;
    strategy: string;
    openedBy: string;
    openedAt: string;
}
export interface Trade {
    id: string;
    asset: string;
    type: 'stock' | 'prediction_market';
    action: 'buy' | 'sell';
    price: number;
    size: number;
    pnl?: number;
    strategy: string;
    copiedFrom?: string;
    timestamp: string;
}
export declare const demoPortfolio: PortfolioSummary;
export declare const demoStrategies: Strategy[];
export declare const demoSignals: Signal[];
export declare const demoAgents: Agent[];
export declare const demoPredictionMarkets: PredictionMarket[];
export declare const demoTopTraders: TopTrader[];
export declare const demoPositions: Position[];
export declare const demoTrades: Trade[];
export interface RiskMetrics {
    vix: number;
    vixRegime: 'Low' | 'Moderate' | 'High' | 'Extreme';
    portfolioVolatility: number;
    maxSingleAsset: number;
    maxSector: number;
    currentLeverage: number;
    maxLeverage: number;
    varDaily: number;
    topConcentrations: {
        name: string;
        exposure: number;
    }[];
}
export declare const demoRiskMetrics: RiskMetrics;
