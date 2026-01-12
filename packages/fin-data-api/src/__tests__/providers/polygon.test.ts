/**
 * Polygon Provider Unit Tests
 */

import {
  PolygonStockQuoteFetcher,
  PolygonStockQuoteQuerySchema,
  PolygonStockQuoteDataSchema,
} from '../../providers/polygon/models/stockQuote';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Polygon Provider', () => {
  testFetcherInterface(PolygonStockQuoteFetcher, 'PolygonStockQuoteFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'AAPL' };
      expect(() => PolygonStockQuoteQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      const query = {};
      expect(() => PolygonStockQuoteQuerySchema.parse(query)).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        symbol: 'AAPL',
        last_price: 150.0,
        timestamp: 1234567890,
      };
      expect(() => PolygonStockQuoteDataSchema.parse(data)).not.toThrow();
    });

    it('should require required fields', () => {
      const data = { symbol: 'AAPL' };
      expect(() => PolygonStockQuoteDataSchema.parse(data)).toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: PolygonStockQuoteFetcher;

    beforeEach(() => {
      fetcher = new PolygonStockQuoteFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ symbol: 'AAPL' });
      expect(query.symbol).toBe('AAPL');
    });

    it('should require API key for extraction', async () => {
      const query = { symbol: 'AAPL' };
      await expect(fetcher.extractData(query, {})).rejects.toThrow(
        'Polygon API key is required'
      );
    });
  });
});
