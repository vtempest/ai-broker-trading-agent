/**
 * Trading Economics Provider Unit Tests
 */

import {
  TradingEconomicsIndicatorsFetcher,
  TradingEconomicsIndicatorsQuerySchema,
  TradingEconomicsIndicatorsDataSchema,
} from '../../providers/tradingeconomics/models/indicators';
import { testFetcherInterface } from '../utils/testHelpers';

describe('Trading Economics Provider', () => {
  testFetcherInterface(TradingEconomicsIndicatorsFetcher, 'TradingEconomicsIndicatorsFetcher');

  describe('Query Schema', () => {
    it('should validate correct query', () => {
      const query = { country: 'united states', indicator: 'gdp' };
      expect(() => TradingEconomicsIndicatorsQuerySchema.parse(query)).not.toThrow();
    });

    it('should require country and indicator', () => {
      expect(() => TradingEconomicsIndicatorsQuerySchema.parse({})).toThrow();
    });
  });

  describe('Data Schema', () => {
    it('should validate correct data', () => {
      const data = {
        country: 'United States',
        indicator: 'GDP',
        date: '2023-01-01',
        value: 25000,
      };
      expect(() => TradingEconomicsIndicatorsDataSchema.parse(data)).not.toThrow();
    });
  });

  describe('Fetcher Methods', () => {
    let fetcher: TradingEconomicsIndicatorsFetcher;

    beforeEach(() => {
      fetcher = new TradingEconomicsIndicatorsFetcher();
    });

    it('should require API key', async () => {
      const query = { country: 'us', indicator: 'gdp' };
      await expect(fetcher.extractData(query, {})).rejects.toThrow(
        'Trading Economics API key is required'
      );
    });
  });
});
