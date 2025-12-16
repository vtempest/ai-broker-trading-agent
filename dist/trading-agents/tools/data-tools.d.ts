import { StockData, TechnicalIndicators, FundamentalsData, NewsItem } from '../types';
/**
 * Get historical stock data for a symbol
 */
export declare function getStockData(symbol: string, startDate: Date, endDate: Date): Promise<StockData[]>;
/**
 * Calculate technical indicators from stock data
 */
export declare function getIndicators(stockData: StockData[], indicators: string[]): Promise<TechnicalIndicators>;
/**
 * Get fundamentals data for a symbol
 */
export declare function getFundamentals(symbol: string): Promise<FundamentalsData>;
/**
 * Get news articles for a symbol
 */
export declare function getNews(symbol: string, limit?: number): Promise<NewsItem[]>;
