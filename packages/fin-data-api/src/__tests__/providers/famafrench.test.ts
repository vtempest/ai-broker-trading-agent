/**
 * Fama-French Provider Unit Tests
 */

import {
  FamaFrenchFactorDataFetcher,
  FamaFrenchFactorDataQuerySchema,
  FamaFrenchFactorDataDataSchema,
} from '../../providers/famafrench/models/factorData';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Fama-French Provider', () => {
  testFetcherInterface(FamaFrenchFactorDataFetcher, 'FamaFrenchFactorDataFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { factor: 'F-F_Research_Data_Factors' };
      expect(() => FamaFrenchFactorDataQuerySchema.parse(query)).not.toThrow();
    });

    it('should use default factor', () => {
      const result = FamaFrenchFactorDataQuerySchema.parse({});
      expect(result.factor).toBe('F-F_Research_Data_Factors');
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        mkt_rf: 1.5,
        smb: 0.5,
        hml: 0.3,
        rf: 0.1,
      };
      expect(() => FamaFrenchFactorDataDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: FamaFrenchFactorDataFetcher;

    beforeEach(() => {
      fetcher = new FamaFrenchFactorDataFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ factor: 'TEST' });
      expect(query.factor).toBe('TEST');
    });
  });
});
