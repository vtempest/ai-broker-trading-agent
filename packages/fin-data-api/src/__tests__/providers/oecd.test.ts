/**
 * OECD Provider Unit Tests
 */

import {
  OECDEconomicDataFetcher,
  OECDEconomicDataQuerySchema,
  OECDEconomicDataDataSchema,
} from '../../providers/oecd/models/economicData';
import { testFetcherInterface } from '../utils/testHelpers';

describe('OECD Provider', () => {
  testFetcherInterface(OECDEconomicDataFetcher, 'OECDEconomicDataFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { indicator: 'GDP', country: 'USA' };
      expect(() => OECDEconomicDataQuerySchema.parse(query)).not.toThrow();
    });

    it('should require indicator', () => {
      expect(() => OECDEconomicDataQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        country: 'USA',
        indicator: 'GDP',
        value: 25000,
      };
      expect(() => OECDEconomicDataDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: OECDEconomicDataFetcher;

    beforeEach(() => {
      fetcher = new OECDEconomicDataFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ indicator: 'GDP', country: 'USA' });
      expect(query.indicator).toBe('GDP');
    });
  });
});
