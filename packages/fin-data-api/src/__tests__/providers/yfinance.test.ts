/**
 * Yahoo Finance Provider Unit Tests
 */

import {
  YFinanceQuoteFetcher,
  YFinanceQuoteQuerySchema,
  YFinanceQuoteDataSchema,
} from '../../providers/yfinance/models/quote';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Yahoo Finance Provider', () => {
  testFetcherInterface(YFinanceQuoteFetcher, 'YFinanceQuoteFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'AAPL' };
      expect(() => YFinanceQuoteQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      const query = {};
      expect(() => YFinanceQuoteQuerySchema.parse(query)).toThrow();
    });

    it('should accept comma-separated symbols', () => {
      const query = { symbol: 'AAPL,MSFT,GOOGL' };
      expect(() => YFinanceQuoteQuerySchema.parse(query)).not.toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        symbol: 'AAPL',
        price: 150.0,
      };
      expect(() => YFinanceQuoteDataSchema.parse(data)).not.toThrow();
    });

    it('should require symbol and price', () => {
      const data = { symbol: 'AAPL' };
      expect(() => YFinanceQuoteDataSchema.parse(data)).toThrow();
    });

    it('should accept optional fields', () => {
      const data = {
        symbol: 'AAPL',
        price: 150.0,
        name: 'Apple Inc.',
        market_cap: 2000000000000,
        pe_ratio: 25.5,
      };
      expect(() => YFinanceQuoteDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: YFinanceQuoteFetcher;

    beforeEach(() => {
      fetcher = new YFinanceQuoteFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ symbol: 'AAPL' });
      expect(query.symbol).toBe('AAPL');
    });
  });
});
