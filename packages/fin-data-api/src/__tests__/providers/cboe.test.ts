/**
 * CBOE Provider Unit Tests
 */

import {
  CBOEIndexFetcher,
  CBOEIndexQuerySchema,
  CBOEIndexDataSchema,
} from '../../providers/cboe/models/index';
import { testFetcherInterface } from '../utils/testHelpers';

describe('CBOE Provider', () => {
  testFetcherInterface(CBOEIndexFetcher, 'CBOEIndexFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'VIX' };
      expect(() => CBOEIndexQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      expect(() => CBOEIndexQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        open: 20.5,
        high: 21.0,
        low: 20.0,
        close: 20.8,
      };
      expect(() => CBOEIndexDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: CBOEIndexFetcher;

    beforeEach(() => {
      fetcher = new CBOEIndexFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ symbol: 'VIX' });
      expect(query.symbol).toBe('VIX');
    });
  });
});
