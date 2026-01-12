/**
 * Tradier Provider Unit Tests
 */

import {
  TradierQuoteFetcher,
  TradierQuoteQuerySchema,
  TradierQuoteDataSchema,
} from '../../providers/tradier/models/quote';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Tradier Provider', () => {
  testFetcherInterface(TradierQuoteFetcher, 'TradierQuoteFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'AAPL' };
      expect(() => TradierQuoteQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      expect(() => TradierQuoteQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        symbol: 'AAPL',
        last: 150.0,
        bid: 149.5,
        ask: 150.5,
      };
      expect(() => TradierQuoteDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: TradierQuoteFetcher;

    beforeEach(() => {
      fetcher = new TradierQuoteFetcher();
    });

    it('should require API key', async () => {
      const query = { symbol: 'AAPL' };
      await expect(fetcher.extractData(query, {})).rejects.toThrow('Tradier API key is required');
    });
  });
});
