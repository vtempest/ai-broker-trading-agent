interface MarketData {
    question: string;
    description?: string;
    currentYesPrice: number;
    currentNoPrice: number;
    volume24hr?: number;
    volumeTotal?: number;
    tags?: string[];
}
interface DebateAnalysis {
    yesArguments: string[];
    noArguments: string[];
    yesSummary: string;
    noSummary: string;
    keyFactors: string[];
    uncertainties: string[];
}
interface DebateAnalysis {
    yesArguments: string[];
    noArguments: string[];
    yesSummary: string;
    noSummary: string;
    keyFactors: string[];
    uncertainties: string[];
    modelYesProbability: number;
    modelNoProbability: number;
    commentaryOnDiscrepancy: string;
}
export declare function generateDebateAnalysis(marketData: MarketData, apiKey?: string): Promise<DebateAnalysis>;
export declare function generateDebateAnalysisWithOpenAI(marketData: MarketData, apiKey?: string): Promise<DebateAnalysis>;
export {};
