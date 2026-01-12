/**
 * CFTC (Commodity Futures Trading Commission) Provider Unit Tests
 */

import {
  CftcCotFetcher,
  CftcCotQuerySchema,
  CftcCotDataSchema,
} from '../../providers/cftc/models/cot';
import { testFetcherInterface } from '../utils/testHelpers';

describe('CFTC Provider', () => {
  testFetcherInterface(CftcCotFetcher, 'CftcCotFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { id: 'corn' };
      expect(() => CftcCotQuerySchema.parse(query)).not.toThrow();
    });

    it('should use default id', () => {
      const result = CftcCotQuerySchema.parse({});
      expect(result.id).toBe('all');
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        commodity: 'Corn',
        market_and_exchange_names: 'CBOT',
      };
      expect(() => CftcCotDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: CftcCotFetcher;

    beforeEach(() => {
      fetcher = new CftcCotFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ id: 'corn' });
      expect(query.id).toBe('corn');
    });
  });
});
