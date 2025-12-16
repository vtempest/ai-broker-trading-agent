import { AgentState, TradingConfig, TradeSignal, AnalystType } from '../types';
export declare class TradingAgentsGraph {
    private config;
    private deepThinkingLLM;
    private quickThinkingLLM;
    private selectedAnalysts;
    private debug;
    private bullMemory;
    private bearMemory;
    private traderMemory;
    private investJudgeMemory;
    private riskManagerMemory;
    private marketAnalyst;
    private bullResearcher;
    private bearResearcher;
    private investmentJudge;
    private trader;
    private currentState;
    private ticker;
    private logStatesDict;
    constructor(selectedAnalysts?: AnalystType[], debug?: boolean, config?: TradingConfig);
    /**
     * Run the trading agents graph for a company on a specific date
     */
    propagate(companyName: string, tradeDate: string): Promise<{
        state: AgentState;
        signal: TradeSignal;
    }>;
    /**
     * Create initial state for the graph
     */
    private createInitialState;
    /**
     * Extract trading decision from text
     */
    private extractDecision;
    /**
     * Process a trading signal
     */
    private processSignal;
    /**
     * Log the final state
     */
    private logState;
    /**
     * Reflect on decisions and update memory
     */
    reflectAndRemember(returnsLosses: number): Promise<void>;
    /**
     * Get all logged states
     */
    getLogStates(): Record<string, any>;
    /**
     * Get the current state
     */
    getCurrentState(): AgentState | null;
}
