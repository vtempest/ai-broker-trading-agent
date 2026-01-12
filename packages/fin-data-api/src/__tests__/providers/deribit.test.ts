/**
 * Deribit Provider Unit Tests
 */

import {
  DeribitOptionsFetcher,
  DeribitOptionsQuerySchema,
  DeribitOptionsDataSchema,
} from '../../providers/deribit/models/options';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Deribit Provider', () => {
  testFetcherInterface(DeribitOptionsFetcher, 'DeribitOptionsFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { currency: 'BTC' };
      expect(() => DeribitOptionsQuerySchema.parse(query)).not.toThrow();
    });

    it('should require currency', () => {
      expect(() => DeribitOptionsQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        instrument_name: 'BTC-31MAR23-20000-C',
        strike: 20000,
        expiration: '2023-03-31',
        option_type: 'call',
        mark_price: 1500.0,
      };
      expect(() => DeribitOptionsDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: DeribitOptionsFetcher;

    beforeEach(() => {
      fetcher = new DeribitOptionsFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ currency: 'BTC' });
      expect(query.currency).toBe('BTC');
    });
  });
});
