import { Message, TradingConfig } from '../types';
export interface LLMResponse {
    content: string;
    toolCalls?: Array<{
        name: string;
        arguments: Record<string, any>;
    }>;
}
export declare class UnifiedLLMClient {
    private provider;
    private model;
    private temperature;
    private apiKey;
    private baseUrl?;
    constructor(config: TradingConfig, model: string);
    /**
     * Invoke the LLM with a prompt
     */
    invoke(input: string | Message[]): Promise<LLMResponse>;
    /**
     * Invoke OpenAI API
     */
    private invokeOpenAI;
    /**
     * Invoke Groq API (OpenAI-compatible)
     */
    private invokeGroq;
    /**
     * Invoke Anthropic API
     */
    private invokeAnthropic;
    /**
     * Invoke with tool binding
     */
    invokeWithTools(messages: Message[], tools: any[]): Promise<LLMResponse>;
    /**
     * Invoke OpenAI/Groq with tools
     */
    private invokeWithToolsOpenAI;
}
/**
 * Create an LLM client instance
 */
export declare function createLLM(config: TradingConfig, model: string): UnifiedLLMClient;
