/**
 * Federal Reserve Provider Unit Tests
 */

import {
  FederalReserveInterestRatesFetcher,
  FederalReserveInterestRatesQuerySchema,
  FederalReserveInterestRatesDataSchema,
} from '../../providers/federal_reserve/models/interestRates';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Federal Reserve Provider', () => {
  testFetcherInterface(FederalReserveInterestRatesFetcher, 'FederalReserveInterestRatesFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = {};
      expect(() => FederalReserveInterestRatesQuerySchema.parse(query)).not.toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        rate: 5.25,
        rate_type: 'Federal Funds Rate',
      };
      expect(() => FederalReserveInterestRatesDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: FederalReserveInterestRatesFetcher;

    beforeEach(() => {
      fetcher = new FederalReserveInterestRatesFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({});
      expect(query).toBeDefined();
    });
  });
});
