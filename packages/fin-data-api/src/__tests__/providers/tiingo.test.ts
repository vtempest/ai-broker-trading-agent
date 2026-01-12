/**
 * Tiingo Provider Unit Tests
 */

import {
  TiingoStockPriceFetcher,
  TiingoStockPriceQuerySchema,
  TiingoStockPriceDataSchema,
} from '../../providers/tiingo/models/stockPrice';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Tiingo Provider', () => {
  testFetcherInterface(TiingoStockPriceFetcher, 'TiingoStockPriceFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'AAPL' };
      expect(() => TiingoStockPriceQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      expect(() => TiingoStockPriceQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        close: 150.0,
        high: 155.0,
        low: 149.0,
        open: 151.0,
        volume: 50000000,
        adj_close: 150.0,
      };
      expect(() => TiingoStockPriceDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: TiingoStockPriceFetcher;

    beforeEach(() => {
      fetcher = new TiingoStockPriceFetcher();
    });

    it('should require API key', async () => {
      const query = fetcher.transformQuery({ symbol: 'AAPL' });
      await expect(fetcher.extractData(query, {})).rejects.toThrow('Tiingo API key is required');
    });
  });
});
