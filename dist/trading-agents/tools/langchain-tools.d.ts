/**
 * LangChain-style Tool System for Trading Agents
 * Provides a standardized interface for tools that can be used by LLMs
 */
/**
 * Tool interface compatible with LangChain tool format
 */
export interface Tool {
    /** Name of the tool */
    name: string;
    /** Description of what the tool does */
    description: string;
    /** JSON schema for the tool's input parameters */
    inputSchema: {
        type: 'object';
        properties: Record<string, any>;
        required: string[];
    };
    /** Function that executes the tool */
    func: (input: any) => Promise<string>;
}
/**
 * Get historical stock price data
 */
export declare const getStockDataTool: Tool;
/**
 * Calculate technical indicators
 */
export declare const getTechnicalIndicatorsTool: Tool;
/**
 * Get fundamental data
 */
export declare const getFundamentalsTool: Tool;
/**
 * Get news articles
 */
export declare const getNewsTool: Tool;
/**
 * Groq debate analysis tool
 */
export declare const groqDebateTool: Tool;
/**
 * All available tools for trading agents
 */
export declare const tradingTools: Tool[];
/**
 * Convert tools to OpenAI function calling format
 */
export declare function toolsToOpenAIFunctions(tools: Tool[]): {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, any>;
            required: string[];
        };
    };
}[];
/**
 * Execute a tool by name with given input
 */
export declare function executeTool(toolName: string, input: any): Promise<string>;
/**
 * Agent executor that handles LLM + tools interaction
 */
export declare class AgentExecutor {
    private llm;
    private tools;
    private maxIterations;
    constructor(llm: any, tools: Tool[], maxIterations?: number);
    /**
     * Execute the agent with a given prompt
     */
    run(prompt: string): Promise<string>;
}
