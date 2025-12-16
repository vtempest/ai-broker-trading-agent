import { AgentState, InvestDebateState, RiskDebateState } from '../types';
import { UnifiedLLMClient } from '../utils/llm-client';
export declare class InvestmentDebateFacilitator {
    private llm;
    private maxRounds;
    constructor(llm: UnifiedLLMClient, maxRounds?: number);
    /**
     * Determine if the debate should continue or conclude
     */
    shouldContinue(debateState: InvestDebateState): boolean;
    /**
     * Synthesize the debate and make a final decision
     */
    makeDecision(state: AgentState): Promise<Partial<AgentState>>;
}
export declare class RiskDebateFacilitator {
    private llm;
    private maxRounds;
    constructor(llm: UnifiedLLMClient, maxRounds?: number);
    shouldContinue(debateState: RiskDebateState): boolean;
    /**
     * Synthesize risk debate and adjust trading plan
     */
    makeDecision(state: AgentState): Promise<Partial<AgentState>>;
}
