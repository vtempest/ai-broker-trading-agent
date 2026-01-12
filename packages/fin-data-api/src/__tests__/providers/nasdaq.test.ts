/**
 * NASDAQ Provider Unit Tests
 */

import {
  NasdaqQuoteFetcher,
  NasdaqQuoteQuerySchema,
  NasdaqQuoteDataSchema,
} from '../../providers/nasdaq/models/quote';
import { testFetcherInterface } from '../utils/testHelpers';

describe('NASDAQ Provider', () => {
  testFetcherInterface(NasdaqQuoteFetcher, 'NasdaqQuoteFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'AAPL' };
      expect(() => NasdaqQuoteQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      expect(() => NasdaqQuoteQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        symbol: 'AAPL',
        last_price: 150.0,
      };
      expect(() => NasdaqQuoteDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: NasdaqQuoteFetcher;

    beforeEach(() => {
      fetcher = new NasdaqQuoteFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ symbol: 'AAPL' });
      expect(query.symbol).toBe('AAPL');
    });
  });
});
