import { AgentState } from '../types';
import { UnifiedLLMClient } from '../utils/llm-client';
export declare class MarketAnalyst {
    private llm;
    constructor(llm: UnifiedLLMClient);
    analyze(state: AgentState): Promise<Partial<AgentState>>;
}
