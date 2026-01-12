/**
 * Congress.gov Provider Unit Tests
 */

import {
  CongressBillsFetcher,
  CongressBillsQuerySchema,
  CongressBillsDataSchema,
} from '../../providers/congress_gov/models/congressBills';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Congress.gov Provider', () => {
  testFetcherInterface(CongressBillsFetcher, 'CongressBillsFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { congress: 118 };
      expect(() => CongressBillsQuerySchema.parse(query)).not.toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        bill_number: 'H.R.1234',
        title: 'Test Bill',
        congress: 118,
        introduced_date: '2023-01-01',
      };
      expect(() => CongressBillsDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: CongressBillsFetcher;

    beforeEach(() => {
      fetcher = new CongressBillsFetcher();
    });

    it('should require API key', async () => {
      const query = { congress: 118 };
      await expect(fetcher.extractData(query, {})).rejects.toThrow(
        'Congress.gov API key is required'
      );
    });
  });
});
