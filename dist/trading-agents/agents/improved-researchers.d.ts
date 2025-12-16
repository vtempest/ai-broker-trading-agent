import { AgentState } from '../types';
import { UnifiedLLMClient } from '../utils/llm-client';
import { FinancialSituationMemory } from '../utils/memory';
export declare class ImprovedBullResearcher {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    analyze(state: AgentState): Promise<Partial<AgentState>>;
}
export declare class ImprovedBearResearcher {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    analyze(state: AgentState): Promise<Partial<AgentState>>;
}
