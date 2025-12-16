import { Tool } from './langchain-tools';
/**
 * Get account information
 */
export declare const getAccountTool: Tool;
/**
 * Get current positions
 */
export declare const getPositionsTool: Tool;
/**
 * Get latest quote for a symbol
 */
export declare const getQuoteTool: Tool;
/**
 * Get historical bars/candles
 */
export declare const getBarsTool: Tool;
/**
 * Place an order
 */
export declare const placeOrderTool: Tool;
/**
 * Get open orders
 */
export declare const getOrdersTool: Tool;
/**
 * Cancel an order
 */
export declare const cancelOrderTool: Tool;
/**
 * Close a position
 */
export declare const closePositionTool: Tool;
/**
 * Get market calendar
 */
export declare const getMarketCalendarTool: Tool;
/**
 * All Alpaca MCP tools
 */
export declare const alpacaMCPTools: Tool[];
/**
 * Get safe tools (read-only, no order placement)
 */
export declare const safeAlpacaTools: Tool[];
