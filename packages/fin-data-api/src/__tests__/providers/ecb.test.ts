/**
 * ECB (European Central Bank) Provider Unit Tests
 */

import {
  ECBExchangeRatesFetcher,
  ECBExchangeRatesQuerySchema,
  ECBExchangeRatesDataSchema,
} from '../../providers/ecb/models/exchangeRates';
import { testFetcherInterface } from '../utils/testHelpers';

describe('ECB Provider', () => {
  testFetcherInterface(ECBExchangeRatesFetcher, 'ECBExchangeRatesFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { currency: 'USD' };
      expect(() => ECBExchangeRatesQuerySchema.parse(query)).not.toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        currency: 'USD',
        rate: 1.08,
      };
      expect(() => ECBExchangeRatesDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: ECBExchangeRatesFetcher;

    beforeEach(() => {
      fetcher = new ECBExchangeRatesFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ currency: 'USD' });
      expect(query.currency).toBe('USD');
    });
  });
});
