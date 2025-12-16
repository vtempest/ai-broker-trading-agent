import { AgentState } from '../types';
import { UnifiedLLMClient } from '../utils/llm-client';
import { FinancialSituationMemory } from '../utils/memory';
export declare class RiskyAnalyst {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    analyze(state: AgentState): Promise<Partial<AgentState>>;
}
export declare class SafeAnalyst {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    analyze(state: AgentState): Promise<Partial<AgentState>>;
}
export declare class NeutralAnalyst {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    analyze(state: AgentState): Promise<Partial<AgentState>>;
}
