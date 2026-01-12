/**
 * SEC Provider Unit Tests
 */

import {
  SECFilingsFetcher,
  SECFilingsQuerySchema,
  SECFilingsDataSchema,
} from '../../providers/sec/models/filings';
import { testFetcherInterface } from '../utils/testHelpers';

describe('SEC Provider', () => {
  testFetcherInterface(SECFilingsFetcher, 'SECFilingsFetcher');

  describe('Query Schema', () => {
    it('should validate correct query with symbol', () => {
      const query = { symbol: 'AAPL' };
      expect(() => SECFilingsQuerySchema.parse(query)).not.toThrow();
    });

    it('should validate correct query with CIK', () => {
      const query = { cik: '0000320193' };
      expect(() => SECFilingsQuerySchema.parse(query)).not.toThrow();
    });

    it('should accept optional parameters', () => {
      const query = {
        symbol: 'AAPL',
        form_type: '10-K',
        limit: 50,
      };
      expect(() => SECFilingsQuerySchema.parse(query)).not.toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        filing_date: '2023-01-01',
        cik: '0000320193',
        form_type: '10-K',
        filing_url: 'https://sec.gov',
      };
      expect(() => SECFilingsDataSchema.parse(data)).not.toThrow();
    });

    it('should require required fields', () => {
      const data = { filing_date: '2023-01-01' };
      expect(() => SECFilingsDataSchema.parse(data)).toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: SECFilingsFetcher;

    beforeEach(() => {
      fetcher = new SECFilingsFetcher();
    });

    it('should transform query with symbol', () => {
      const query = fetcher.transformQuery({ symbol: 'AAPL' });
      expect(query.symbol).toBe('AAPL');
      expect(query.limit).toBe(100);
    });

    it('should require symbol or CIK', () => {
      expect(() => fetcher.transformQuery({})).toThrow(
        'Either symbol or CIK is required'
      );
    });
  });
});
