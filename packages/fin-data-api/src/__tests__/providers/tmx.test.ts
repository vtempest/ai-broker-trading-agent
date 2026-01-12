/**
 * TMX Provider Unit Tests
 */

import {
  TMXQuoteFetcher,
  TMXQuoteQuerySchema,
  TMXQuoteDataSchema,
} from '../../providers/tmx/models/quote';
import { testFetcherInterface } from '../utils/testHelpers';

describe('TMX Provider', () => {
  testFetcherInterface(TMXQuoteFetcher, 'TMXQuoteFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'SHOP' };
      expect(() => TMXQuoteQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      expect(() => TMXQuoteQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        symbol: 'SHOP',
        price: 75.0,
      };
      expect(() => TMXQuoteDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: TMXQuoteFetcher;

    beforeEach(() => {
      fetcher = new TMXQuoteFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ symbol: 'SHOP' });
      expect(query.symbol).toBe('SHOP');
    });
  });
});
