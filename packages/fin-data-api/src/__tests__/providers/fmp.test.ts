/**
 * FMP (Financial Modeling Prep) Provider Unit Tests
 */

import {
  FMPQuoteFetcher,
  FMPQuoteQuerySchema,
  FMPQuoteDataSchema,
} from '../../providers/fmp/models/quote';
import { testFetcherInterface } from '../utils/testHelpers';

describe('FMP Provider', () => {
  testFetcherInterface(FMPQuoteFetcher, 'FMPQuoteFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { symbol: 'AAPL' };
      expect(() => FMPQuoteQuerySchema.parse(query)).not.toThrow();
    });

    it('should require symbol', () => {
      expect(() => FMPQuoteQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        symbol: 'AAPL',
        price: 150.0,
        name: 'Apple Inc.',
      };
      expect(() => FMPQuoteDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: FMPQuoteFetcher;

    beforeEach(() => {
      fetcher = new FMPQuoteFetcher();
    });

    it('should require API key', async () => {
      const query = { symbol: 'AAPL' };
      await expect(fetcher.extractData(query, {})).rejects.toThrow('FMP API key is required');
    });
  });
});
