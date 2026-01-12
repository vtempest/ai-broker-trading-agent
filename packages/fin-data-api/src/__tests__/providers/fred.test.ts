/**
 * FRED Provider Unit Tests
 */

import {
  FREDSeriesFetcher,
  FREDSeriesQuerySchema,
  FREDSeriesDataSchema,
} from '../../providers/fred/models/series';
import { testFetcherInterface } from '../utils/testHelpers';

describe('FRED Provider', () => {
  testFetcherInterface(FREDSeriesFetcher, 'FREDSeriesFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { series_id: 'GDP' };
      expect(() => FREDSeriesQuerySchema.parse(query)).not.toThrow();
    });

    it('should require series_id', () => {
      const query = {};
      expect(() => FREDSeriesQuerySchema.parse(query)).toThrow();
    });

    it('should accept optional parameters', () => {
      const query = {
        series_id: 'GDP',
        start_date: '2020-01-01',
        end_date: '2023-12-31',
        frequency: 'm' as const,
        aggregation_method: 'avg' as const,
      };
      expect(() => FREDSeriesQuerySchema.parse(query)).not.toThrow();
    });

    it('should validate frequency enum', () => {
      const validFrequencies = ['d', 'w', 'bw', 'm', 'q', 'sa', 'a'];
      validFrequencies.forEach((frequency) => {
        const query = { series_id: 'GDP', frequency };
        expect(() => FREDSeriesQuerySchema.parse(query)).not.toThrow();
      });
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        value: 100.5,
      };
      expect(() => FREDSeriesDataSchema.parse(data)).not.toThrow();
    });

    it('should accept null values', () => {
      const data = {
        date: '2023-01-01',
        value: null,
      };
      expect(() => FREDSeriesDataSchema.parse(data)).not.toThrow();
    });

    it('should require date and value fields', () => {
      const data = { date: '2023-01-01' };
      expect(() => FREDSeriesDataSchema.parse(data)).toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: FREDSeriesFetcher;

    beforeEach(() => {
      fetcher = new FREDSeriesFetcher();
    });

    it('should transform query', () => {
      const query = fetcher.transformQuery({ series_id: 'GDP' });
      expect(query.series_id).toBe('GDP');
      expect(query.aggregation_method).toBe('avg');
    });

    it('should require API key for extraction', async () => {
      const query = fetcher.transformQuery({ series_id: 'GDP' });
      await expect(fetcher.extractData(query, {})).rejects.toThrow(
        'FRED API key is required'
      );
    });
  });
});
