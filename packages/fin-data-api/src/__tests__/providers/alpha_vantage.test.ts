/**
 * Alpha Vantage Provider Unit Tests
 */

import {
  AVEquityHistoricalFetcher,
  AVEquityHistoricalQuerySchema,
  AVEquityHistoricalDataSchema,
} from '../../providers/alpha_vantage/models/equityHistorical';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Alpha Vantage Provider', () => {
  testFetcherInterface(AVEquityHistoricalFetcher, 'AVEquityHistoricalFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = {
        symbol: 'AAPL',
        interval: '1d' as const,
      };
      expect(() => AVEquityHistoricalQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      const query = {};
      expect(() => AVEquityHistoricalQuerySchema.parse(query)).toThrow();
    });

    it('should accept valid intervals', () => {
      const intervals = ['1m', '5m', '15m', '30m', '60m', '1d', '1W', '1M'];
      intervals.forEach((interval) => {
        const query = { symbol: 'AAPL', interval };
        expect(() => AVEquityHistoricalQuerySchema.parse(query)).not.toThrow();
      });
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        symbol: 'AAPL',
        open: 150.0,
        high: 155.0,
        low: 149.0,
        close: 154.0,
        volume: 50000000,
      };
      expect(() => AVEquityHistoricalDataSchema.parse(data)).not.toThrow();
    });

    it('should require required fields', () => {
      const data = {
        date: '2023-01-01',
      };
      expect(() => AVEquityHistoricalDataSchema.parse(data)).toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: AVEquityHistoricalFetcher;

    beforeEach(() => {
      fetcher = new AVEquityHistoricalFetcher();
    });

    it('should transform query with defaults', () => {
      const query = fetcher.transformQuery({ symbol: 'AAPL' });
      expect(query.symbol).toBe('AAPL');
      expect(query.interval).toBe('1d');
      expect(query.start_date).toBeDefined();
      expect(query.end_date).toBeDefined();
    });

    it('should require API key for extraction', async () => {
      const query = fetcher.transformQuery({ symbol: 'AAPL' });
      await expect(fetcher.extractData(query, {})).rejects.toThrow(
        'Alpha Vantage API key is required'
      );
    });
  });
});
