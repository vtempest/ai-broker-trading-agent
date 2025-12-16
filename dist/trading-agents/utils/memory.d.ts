import { Memory, TradingConfig } from '../types';
export declare class FinancialSituationMemory {
    private name;
    private memories;
    private config;
    constructor(name: string, config: TradingConfig);
    /**
     * Add a new memory to the store
     */
    addMemory(memory: Memory): Promise<void>;
    /**
     * Get memories similar to the current situation
     * Uses simple keyword matching for now, can be enhanced with embeddings
     */
    getMemories(currentSituation: string, nMatches?: number): Promise<Memory[]>;
    /**
     * Calculate similarity between two text strings using keyword overlap
     * Can be enhanced with more sophisticated methods like cosine similarity with embeddings
     */
    private calculateSimilarity;
    /**
     * Tokenize text into meaningful words
     */
    private tokenize;
    /**
     * Clear all memories
     */
    clear(): void;
    /**
     * Get all memories
     */
    getAllMemories(): Memory[];
    /**
     * Get memory count
     */
    getMemoryCount(): number;
}
