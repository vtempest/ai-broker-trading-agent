/**
 * IMF (International Monetary Fund) Provider Unit Tests
 */

import {
  IMFEconomicDataFetcher,
  IMFEconomicDataQuerySchema,
  IMFEconomicDataDataSchema,
} from '../../providers/imf/models/economicData';
import { testFetcherInterface } from '../utils/testHelpers';

describe('IMF Provider', () => {
  testFetcherInterface(IMFEconomicDataFetcher, 'IMFEconomicDataFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { indicator: 'NGDP_R', country: 'US' };
      expect(() => IMFEconomicDataQuerySchema.parse(query)).not.toThrow();
    });

    it('should require indicator', () => {
      expect(() => IMFEconomicDataQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        country: 'US',
        indicator: 'NGDP_R',
        value: 25000,
      };
      expect(() => IMFEconomicDataDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: IMFEconomicDataFetcher;

    beforeEach(() => {
      fetcher = new IMFEconomicDataFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ indicator: 'NGDP_R', country: 'US' });
      expect(query.indicator).toBe('NGDP_R');
    });
  });
});
