import { AgentState } from '../types';
import { UnifiedLLMClient } from '../utils/llm-client';
export declare class FundManager {
    private llm;
    constructor(llm: UnifiedLLMClient);
    /**
     * Review all analysis and make final approval decision
     */
    makeDecision(state: AgentState): Promise<Partial<AgentState>>;
}
