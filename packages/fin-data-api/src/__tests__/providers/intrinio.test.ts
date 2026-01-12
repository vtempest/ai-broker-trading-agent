/**
 * Intrinio Provider Unit Tests
 */

import {
  IntrinioStockPriceFetcher,
  IntrinioStockPriceQuerySchema,
  IntrinioStockPriceDataSchema,
} from '../../providers/intrinio/models/stockPrice';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Intrinio Provider', () => {
  testFetcherInterface(IntrinioStockPriceFetcher, 'IntrinioStockPriceFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'AAPL' };
      expect(() => IntrinioStockPriceQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      expect(() => IntrinioStockPriceQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        open: 150.0,
        high: 155.0,
        low: 149.0,
        close: 154.0,
        volume: 50000000,
      };
      expect(() => IntrinioStockPriceDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: IntrinioStockPriceFetcher;

    beforeEach(() => {
      fetcher = new IntrinioStockPriceFetcher();
    });

    it('should require API key', async () => {
      const query = fetcher.transformQuery({ symbol: 'AAPL' });
      await expect(fetcher.extractData(query, {})).rejects.toThrow('Intrinio API key is required');
    });
  });
});
