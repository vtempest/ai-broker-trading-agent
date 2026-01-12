/**
 * Benzinga Provider Unit Tests
 */

import {
  BenzingaWorldNewsFetcher,
  BenzingaWorldNewsQuerySchema,
  BenzingaWorldNewsDataSchema,
} from '../../providers/benzinga/models/worldNews';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Benzinga Provider', () => {
  testFetcherInterface(BenzingaWorldNewsFetcher, 'BenzingaWorldNewsFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { limit: 10 };
      expect(() => BenzingaWorldNewsQuerySchema.parse(query)).not.toThrow();
    });

    it('should use default values', () => {
      const query = BenzingaWorldNewsQuerySchema.parse({});
      expect(query.display).toBe('full');
      expect(query.sort).toBe('created');
      expect(query.order).toBe('desc');
      expect(query.limit).toBe(100);
    });

    it('should validate enum values', () => {
      const query = {
        display: 'headline' as const,
        sort: 'updated' as const,
        order: 'asc' as const,
      };
      expect(() => BenzingaWorldNewsQuerySchema.parse(query)).not.toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        date: '2023-01-01',
        title: 'Test News',
        url: 'https://example.com',
        id: '123',
      };
      expect(() => BenzingaWorldNewsDataSchema.parse(data)).not.toThrow();
    });

    it('should require required fields', () => {
      const data = { date: '2023-01-01' };
      expect(() => BenzingaWorldNewsDataSchema.parse(data)).toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: BenzingaWorldNewsFetcher;

    beforeEach(() => {
      fetcher = new BenzingaWorldNewsFetcher();
    });

    it('should transform query with defaults', () => {
      const query = fetcher.transformQuery({});
      expect(query.limit).toBe(100);
      expect(query.display).toBe('full');
    });

    it('should require API key for extraction', async () => {
      const query = fetcher.transformQuery({ limit: 10 });
      await expect(fetcher.extractData(query, {})).rejects.toThrow(
        'Benzinga API key is required'
      );
    });
  });
});
