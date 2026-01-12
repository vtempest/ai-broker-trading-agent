/**
 * BizToc Provider Unit Tests
 */

import {
  BizTocNewsFetcher,
  BizTocNewsQuerySchema,
  BizTocNewsDataSchema,
} from '../../providers/biztoc/models/news';
import { testFetcherInterface } from '../utils/testHelpers';

describe('BizToc Provider', () => {
  testFetcherInterface(BizTocNewsFetcher, 'BizTocNewsFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { tag: 'technology' };
      expect(() => BizTocNewsQuerySchema.parse(query)).not.toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        id: '123',
        title: 'Test News',
        url: 'https://example.com',
        created: '2023-01-01T10:00:00Z',
      };
      expect(() => BizTocNewsDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: BizTocNewsFetcher;

    beforeEach(() => {
      fetcher = new BizTocNewsFetcher();
    });

    it('should require RapidAPI key', async () => {
      const query = fetcher.transformQuery({ tag: 'tech' });
      await expect(fetcher.extractData(query, {})).rejects.toThrow('RapidAPI key is required');
    });
  });
});
