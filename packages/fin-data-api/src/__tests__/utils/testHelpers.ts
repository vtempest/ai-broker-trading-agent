/**
 * Test utilities and helpers for provider unit tests
 */

import { Fetcher, QueryParams, Data } from '../../types/base';

/**
 * Mock HTTP responses
 */
export const mockAxios = () => {
  const mockResponse = {
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  return {
    get: jest.fn().mockResolvedValue(mockResponse),
    post: jest.fn().mockResolvedValue(mockResponse),
    response: mockResponse,
  };
};

/**
 * Mock credentials for testing
 */
export const mockCredentials = {
  alpha_vantage_api_key: 'test_av_key',
  fred_api_key: 'test_fred_key',
  fmp_api_key: 'test_fmp_key',
  polygon_api_key: 'test_polygon_key',
  tiingo_api_key: 'test_tiingo_key',
  intrinio_api_key: 'test_intrinio_key',
  benzinga_api_key: 'test_benzinga_key',
  tradier_api_key: 'test_tradier_key',
  eia_api_key: 'test_eia_key',
  bls_api_key: 'test_bls_key',
};

/**
 * Test if a class implements the Fetcher interface
 */
export function testFetcherInterface<Q extends QueryParams, D extends Data>(
  FetcherClass: new () => Fetcher<Q, D>,
  name: string
) {
  describe(`${name} - Fetcher Interface`, () => {
    let fetcher: Fetcher<Q, D>;

    beforeEach(() => {
      fetcher = new FetcherClass();
    });

    it('should implement transformQuery method', () => {
      expect(fetcher.transformQuery).toBeDefined();
      expect(typeof fetcher.transformQuery).toBe('function');
    });

    it('should implement extractData method', () => {
      expect(fetcher.extractData).toBeDefined();
      expect(typeof fetcher.extractData).toBe('function');
    });

    it('should implement transformData method', () => {
      expect(fetcher.transformData).toBeDefined();
      expect(typeof fetcher.transformData).toBe('function');
    });
  });
}

/**
 * Mock HTTP request function
 */
export const mockMakeRequest = (responseData: any) => {
  return jest.fn().mockResolvedValue(responseData);
};

/**
 * Mock failed HTTP request
 */
export const mockMakeRequestError = (error: string) => {
  return jest.fn().mockRejectedValue(new Error(error));
};

/**
 * Helper to test schema validation
 */
export function testSchemaValidation(schema: any, validData: any, invalidData: any) {
  it('should validate correct data', () => {
    expect(() => schema.parse(validData)).not.toThrow();
  });

  it('should reject invalid data', () => {
    expect(() => schema.parse(invalidData)).toThrow();
  });
}

/**
 * Common test data generators
 */
export const testData = {
  symbols: ['AAPL', 'MSFT', 'GOOGL'],
  dates: {
    start: '2023-01-01',
    end: '2023-12-31',
    single: '2023-06-15',
  },
  stockData: {
    symbol: 'AAPL',
    price: 150.0,
    open: 149.5,
    high: 151.0,
    low: 148.5,
    close: 150.0,
    volume: 50000000,
  },
  economicData: {
    date: '2023-01-01',
    value: 100.5,
  },
};
