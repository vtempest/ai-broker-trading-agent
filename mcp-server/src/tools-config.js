// Tool configurations extracted from OpenAPI spec
// Generated: 2025-12-31T21:19:00.877Z

export const toolConfigs = [
  {
    "name": "get_stocks_trending",
    "description": "Get trending stocks",
    "method": "get",
    "pathTemplate": "/stocks/trending",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_stocks_delisted",
    "description": "Get delisted stocks",
    "method": "get",
    "pathTemplate": "/stocks/delisted",
    "executionParameters": [
      {
        "name": "symbol",
        "in": "query"
      },
      {
        "name": "exchange",
        "in": "query"
      },
      {
        "name": "limit",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_user_settings",
    "description": "Get user settings",
    "method": "get",
    "pathTemplate": "/user/settings",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_user_settings",
    "description": "Save user settings",
    "method": "post",
    "pathTemplate": "/user/settings",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_strategies_algo_scripts",
    "description": "Get algo scripts",
    "method": "get",
    "pathTemplate": "/strategies/algo-scripts",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_zulu_sync",
    "description": "Sync Zulu Traders",
    "method": "post",
    "pathTemplate": "/zulu/sync",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_zulu_search",
    "description": "Search Zulu traders",
    "method": "get",
    "pathTemplate": "/zulu/search",
    "executionParameters": [
      {
        "name": "minRoi",
        "in": "query"
      },
      {
        "name": "minWinRate",
        "in": "query"
      },
      {
        "name": "maxDrawdown",
        "in": "query"
      },
      {
        "name": "isEa",
        "in": "query"
      },
      {
        "name": "limit",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_zulu_top_rank",
    "description": "Get top ranked traders",
    "method": "get",
    "pathTemplate": "/zulu/top-rank",
    "executionParameters": [
      {
        "name": "limit",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_polymarket_markets",
    "description": "Get prediction markets",
    "method": "get",
    "pathTemplate": "/polymarket/markets",
    "executionParameters": [
      {
        "name": "limit",
        "in": "query"
      },
      {
        "name": "window",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_polymarket_positions",
    "description": "Get trader positions",
    "method": "post",
    "pathTemplate": "/polymarket/positions",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_stocks_autocomplete",
    "description": "Autocomplete stock search",
    "method": "get",
    "pathTemplate": "/stocks/autocomplete",
    "executionParameters": [
      {
        "name": "q",
        "in": "query"
      },
      {
        "name": "limit",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_stocks_sectors",
    "description": "Get sector information",
    "method": "get",
    "pathTemplate": "/stocks/sectors",
    "executionParameters": [
      {
        "name": "sector",
        "in": "query"
      },
      {
        "name": "includeCompanies",
        "in": "query"
      },
      {
        "name": "includeIndustries",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_stocks_gainers",
    "description": "Get top gainers",
    "method": "get",
    "pathTemplate": "/stocks/gainers",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_stocks_search",
    "description": "Search stocks",
    "method": "get",
    "pathTemplate": "/stocks/search",
    "executionParameters": [
      {
        "name": "q",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_stocks_quote_symbol",
    "description": "Get stock quote",
    "method": "get",
    "pathTemplate": "/stocks/quote/{symbol}",
    "executionParameters": [
      {
        "name": "symbol",
        "in": "path"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_stocks_historical_symbol",
    "description": "Get historical data",
    "method": "get",
    "pathTemplate": "/stocks/historical/{symbol}",
    "executionParameters": [
      {
        "name": "symbol",
        "in": "path"
      },
      {
        "name": "period",
        "in": "query"
      },
      {
        "name": "interval",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_stocks_screener",
    "description": "Screen stocks",
    "method": "post",
    "pathTemplate": "/stocks/screener",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_stocks_predict_statistics",
    "description": "Calculate stock statistics",
    "method": "post",
    "pathTemplate": "/stocks/predict/statistics",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_trading_agents",
    "description": "Analyze stock with AI agents",
    "method": "post",
    "pathTemplate": "/trading-agents",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_groq_debate",
    "description": "Get debate analysis system info",
    "method": "get",
    "pathTemplate": "/groq-debate",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_groq_debate",
    "description": "Multi-agent debate analysis",
    "method": "post",
    "pathTemplate": "/groq-debate",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_backtest",
    "description": "Run strategy backtest",
    "method": "post",
    "pathTemplate": "/backtest",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_backtest_technical",
    "description": "Run technical strategy backtest",
    "method": "post",
    "pathTemplate": "/backtest-technical",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_debate_agents",
    "description": "Quick multi-agent debate analysis",
    "method": "get",
    "pathTemplate": "/debate-agents",
    "executionParameters": [
      {
        "name": "ticker",
        "in": "query"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_debate_agents",
    "description": "Run multi-agent debate analysis",
    "method": "post",
    "pathTemplate": "/debate-agents",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_sec_companies_tickerOrCik_filings",
    "description": "Get company SEC filings",
    "method": "get",
    "pathTemplate": "/sec/companies/{tickerOrCik}/filings",
    "executionParameters": [
      {
        "name": "tickerOrCik",
        "in": "path"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_user_portfolio",
    "description": "Get user portfolio",
    "method": "get",
    "pathTemplate": "/user/portfolio",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_user_portfolio_initialize",
    "description": "Initialize portfolio",
    "method": "post",
    "pathTemplate": "/user/portfolio/initialize",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_user_strategies",
    "description": "Get user strategies",
    "method": "get",
    "pathTemplate": "/user/strategies",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "post_user_strategies",
    "description": "Create strategy",
    "method": "post",
    "pathTemplate": "/user/strategies",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "put_user_strategies_id",
    "description": "Update strategy",
    "method": "put",
    "pathTemplate": "/user/strategies/{id}",
    "executionParameters": [
      {
        "name": "id",
        "in": "path"
      }
    ],
    "requestBodyContentType": "application/json",
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "delete_user_strategies_id",
    "description": "Delete strategy",
    "method": "delete",
    "pathTemplate": "/user/strategies/{id}",
    "executionParameters": [
      {
        "name": "id",
        "in": "path"
      }
    ],
    "baseUrl": "https://autoinvestment.broker/api"
  },
  {
    "name": "get_user_signals",
    "description": "Get user signals",
    "method": "get",
    "pathTemplate": "/user/signals",
    "executionParameters": [],
    "baseUrl": "https://autoinvestment.broker/api"
  }
];

// Create a map for quick lookup
export const toolConfigMap = new Map(toolConfigs.map(t => [t.name, t]));
