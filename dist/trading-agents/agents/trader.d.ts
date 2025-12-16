import { AgentState } from '../types';
import { UnifiedLLMClient } from '../utils/llm-client';
import { FinancialSituationMemory } from '../utils/memory';
export declare class Trader {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    makeDecision(state: AgentState): Promise<Partial<AgentState>>;
}
