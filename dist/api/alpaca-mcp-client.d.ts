/**
 * Alpaca MCP Client
 * Client for interacting with Alpaca Model Context Protocol server
 * Provides trading, market data, and strategy tools
 */
export interface TradingStrategy {
    id?: string;
    name: string;
    description: string;
    rules: StrategyRule[];
    riskManagement: RiskManagement;
    symbols: string[];
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export interface StrategyRule {
    id: string;
    type: 'entry' | 'exit' | 'position_sizing';
    condition: RuleCondition;
    action: RuleAction;
}
export interface RuleCondition {
    indicator: string;
    operator: 'greater_than' | 'less_than' | 'crosses_above' | 'crosses_below' | 'equals';
    value: number | string;
    timeframe?: string;
}
export interface RuleAction {
    type: 'buy' | 'sell' | 'close' | 'hold';
    quantity?: number;
    orderType: 'market' | 'limit' | 'stop' | 'stop_limit';
    limitPrice?: number;
    stopPrice?: number;
}
export interface RiskManagement {
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
    maxDailyLoss: number;
    trailingStop?: number;
}
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    suggestions?: string[];
}
export interface MCPToolCall {
    tool: string;
    arguments: Record<string, any>;
}
export interface MCPToolResponse {
    success: boolean;
    data?: any;
    error?: string;
    isText?: boolean;
}
/**
 * Alpaca MCP Client Class
 */
export declare class AlpacaMCPClient {
    private baseURL;
    private apiKey?;
    private apiSecret?;
    constructor(config?: {
        baseURL?: string;
        apiKey?: string;
        apiSecret?: string;
    });
    private callTool;
    getAccount(): Promise<unknown>;
    getPositions(): Promise<unknown>;
    getPosition(symbol: string): Promise<unknown>;
    getPortfolioHistory(params?: {
        period?: string;
        timeframe?: string;
        start?: string;
        end?: string;
    }): Promise<unknown>;
    placeOrder(params: {
        symbol: string;
        qty?: number;
        notional?: number;
        side: 'buy' | 'sell';
        type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';
        time_in_force?: 'day' | 'gtc' | 'ioc' | 'fok';
        limit_price?: number;
        stop_price?: number;
        trail_percent?: number;
    }): Promise<unknown>;
    getOrders(params?: {
        status?: 'open' | 'closed' | 'all';
        limit?: number;
        symbols?: string;
    }): Promise<unknown>;
    getOrder(orderId: string): Promise<unknown>;
    cancelOrder(orderId: string): Promise<unknown>;
    closePosition(symbol: string, qty?: number): Promise<unknown>;
    closeAllPositions(): Promise<unknown>;
    getQuote(symbol: string): Promise<unknown>;
    getBars(params: {
        symbol: string;
        timeframe: string;
        start?: string;
        end?: string;
        limit?: number;
    }): Promise<unknown>;
    getLatestBar(symbol: string): Promise<unknown>;
    getSnapshot(symbol: string): Promise<unknown>;
    searchAssets(params?: {
        status?: 'active' | 'inactive';
        asset_class?: 'us_equity' | 'crypto';
    }): Promise<unknown>;
    getOptionChain(params: {
        underlying_symbol: string;
        expiration_date?: string;
        expiration_date_gte?: string;
        expiration_date_lte?: string;
        type?: 'call' | 'put';
        strike_price_gte?: number;
        strike_price_lte?: number;
    }): Promise<unknown>;
    placeOptionOrder(params: {
        symbol: string;
        side: 'buy' | 'sell';
        qty: number;
        type?: 'market' | 'limit';
        limit_price?: number;
        time_in_force?: 'day' | 'gtc';
    }): Promise<unknown>;
    getCryptoBars(params: {
        symbol: string;
        timeframe: string;
        start?: string;
        end?: string;
        limit?: number;
    }): Promise<unknown>;
    getCryptoQuote(symbol: string): Promise<unknown>;
    placeCryptoOrder(params: {
        symbol: string;
        qty?: number;
        notional?: number;
        side: 'buy' | 'sell';
        type?: 'market' | 'limit';
        limit_price?: number;
        time_in_force?: 'day' | 'gtc' | 'ioc';
    }): Promise<unknown>;
    getWatchlists(): Promise<unknown>;
    createWatchlist(name: string, symbols: string[]): Promise<unknown>;
    addToWatchlist(watchlistId: string, symbol: string): Promise<unknown>;
    deleteWatchlist(watchlistId: string): Promise<unknown>;
    getMarketCalendar(params?: {
        start?: string;
        end?: string;
    }): Promise<unknown>;
    getCorporateActions(params: {
        symbol: string;
        types?: string;
        start?: string;
        end?: string;
    }): Promise<unknown>;
    chatWithAI(messages: ChatMessage[]): Promise<ChatMessage>;
    generateStrategyFromDescription(description: string): Promise<TradingStrategy>;
}
export declare const alpacaMCPClient: AlpacaMCPClient;
export declare function getAccount(): Promise<unknown>;
export declare function placeOrder(params: Parameters<typeof alpacaMCPClient.placeOrder>[0]): Promise<unknown>;
export declare function getQuote(symbol: string): Promise<unknown>;
export declare function chatWithAI(messages: ChatMessage[]): Promise<ChatMessage>;
