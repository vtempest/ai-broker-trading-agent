/**
 * EIA (Energy Information Administration) Provider Unit Tests
 */

import {
  EIASeriesFetcher,
  EIASeriesQuerySchema,
  EIASeriesDataSchema,
} from '../../providers/eia/models/series';
import { testFetcherInterface } from '../utils/testHelpers';

describe('EIA Provider', () => {
  testFetcherInterface(EIASeriesFetcher, 'EIASeriesFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { series_id: 'PET.EMM_EPM0_PTE_NUS_DPG.W' };
      expect(() => EIASeriesQuerySchema.parse(query)).not.toThrow();
    });

    it('should require series_id', () => {
      expect(() => EIASeriesQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        value: 3.5,
        series_id: 'PET.EMM_EPM0_PTE_NUS_DPG.W',
      };
      expect(() => EIASeriesDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: EIASeriesFetcher;

    beforeEach(() => {
      fetcher = new EIASeriesFetcher();
    });

    it('should require API key', async () => {
      const query = { series_id: 'TEST' };
      await expect(fetcher.extractData(query, {})).rejects.toThrow('EIA API key is required');
    });
  });
});
