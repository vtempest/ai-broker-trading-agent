import { AgentState } from '../types';
import { UnifiedLLMClient } from '../utils/llm-client';
import { FinancialSituationMemory } from '../utils/memory';
export declare class BullResearcher {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    analyze(state: AgentState): Promise<Partial<AgentState>>;
}
export declare class BearResearcher {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    analyze(state: AgentState): Promise<Partial<AgentState>>;
}
export declare class InvestmentJudge {
    private llm;
    private memory;
    constructor(llm: UnifiedLLMClient, memory: FinancialSituationMemory);
    makeDecision(state: AgentState): Promise<Partial<AgentState>>;
}
