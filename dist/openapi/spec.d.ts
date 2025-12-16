export declare const openApiSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
            url: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    paths: {
        "/stocks/trending": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/stocks/delisted": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: string;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                })[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        delisted: {
                                            type: string;
                                        };
                                        count: {
                                            type: string;
                                        };
                                        total: {
                                            type: string;
                                        };
                                        data: {
                                            oneOf: ({
                                                type: string;
                                                properties: {
                                                    symbol: {
                                                        type: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                    };
                                                    delistedDate: {
                                                        type: string;
                                                    };
                                                    reason: {
                                                        type: string;
                                                    };
                                                };
                                                items?: undefined;
                                            } | {
                                                type: string;
                                                items: {
                                                    type: string;
                                                    properties: {
                                                        symbol: {
                                                            type: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                        };
                                                        delistedDate: {
                                                            type: string;
                                                        };
                                                        reason: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                properties?: undefined;
                                            })[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/user/settings": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                    };
                };
            };
        };
        "/strategies/algo-scripts": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            url: {
                                                type: string;
                                            };
                                            name: {
                                                type: string;
                                            };
                                            description: {
                                                type: string;
                                            };
                                            image_url: {
                                                type: string;
                                            };
                                            author: {
                                                type: string;
                                            };
                                            likes_count: {
                                                type: string;
                                            };
                                            comments_count: {
                                                type: string;
                                            };
                                            script_type: {
                                                type: string;
                                            };
                                            created: {
                                                type: string;
                                            };
                                            updated: {
                                                type: string;
                                            };
                                            source: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/zulu/sync": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                traders: {
                                                    type: string;
                                                };
                                            };
                                        };
                                        message: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/zulu/search": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                })[];
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/zulu/top-rank": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/polymarket/markets": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: string;
                    };
                })[];
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/polymarket/positions": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    trader_id: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/stocks/autocomplete": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: ({
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                    required?: undefined;
                })[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        count: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                type: string;
                                                properties: {
                                                    symbol: {
                                                        type: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/stocks/sectors": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        count: {
                                            type: string;
                                        };
                                        data: {
                                            oneOf: ({
                                                type: string;
                                                items: {
                                                    type: string;
                                                    properties: {
                                                        sector: {
                                                            type: string;
                                                        };
                                                        totalCompanies: {
                                                            type: string;
                                                        };
                                                        totalMarketCap: {
                                                            type: string;
                                                        };
                                                        top10Companies: {
                                                            type: string;
                                                            items: {
                                                                $ref: string;
                                                            };
                                                        };
                                                        industries: {
                                                            type: string;
                                                            items: {
                                                                type: string;
                                                                properties: {
                                                                    name: {
                                                                        type: string;
                                                                    };
                                                                    totalCompanies: {
                                                                        type: string;
                                                                    };
                                                                    totalMarketCap: {
                                                                        type: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                properties?: undefined;
                                            } | {
                                                type: string;
                                                properties: {
                                                    sector: {
                                                        type: string;
                                                    };
                                                    totalCompanies: {
                                                        type: string;
                                                    };
                                                    totalMarketCap: {
                                                        type: string;
                                                    };
                                                    top10Companies: {
                                                        type: string;
                                                        items: {
                                                            $ref: string;
                                                        };
                                                    };
                                                    industries: {
                                                        type: string;
                                                        items: {
                                                            type: string;
                                                            properties: {
                                                                name: {
                                                                    type: string;
                                                                };
                                                                totalCompanies: {
                                                                    type: string;
                                                                };
                                                                totalMarketCap: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                items?: undefined;
                                            })[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/stocks/gainers": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/stocks/search": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/stocks/quote/{symbol}": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/stocks/historical/{symbol}": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: ({
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: string;
                    };
                    required?: undefined;
                })[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/stocks/screener": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/stocks/predict/statistics": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                            examples: {
                                rolling_stats: {
                                    summary: string;
                                    value: {
                                        symbol: string;
                                        period: string;
                                        metrics: string[];
                                        window: number;
                                    };
                                };
                                correlation: {
                                    summary: string;
                                    value: {
                                        symbol: string;
                                        correlation: {
                                            target: string;
                                            features: string[];
                                            window: number;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/trading-agents": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/groq-debate": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    symbol: {
                                        type: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/backtest": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/backtest-technical": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    symbol: {
                                        type: string;
                                    };
                                    strategy: {
                                        type: string;
                                        enum: string[];
                                    };
                                    startDate: {
                                        type: string;
                                        format: string;
                                    };
                                    endDate: {
                                        type: string;
                                        format: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/sec/companies/{tickerOrCik}/filings": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/user/portfolio": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/user/portfolio/initialize": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/user/strategies": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                };
            };
        };
        "/user/strategies/{id}": {
            put: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/user/signals": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    components: {
        schemas: {
            Stock: {
                type: string;
                properties: {
                    symbol: {
                        type: string;
                        example: string;
                    };
                    name: {
                        type: string;
                        example: string;
                    };
                    price: {
                        type: string;
                        example: number;
                    };
                    change: {
                        type: string;
                        example: number;
                    };
                    changePercent: {
                        type: string;
                        example: number;
                    };
                };
            };
            StockSearchResult: {
                type: string;
                properties: {
                    symbol: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    exchange: {
                        type: string;
                    };
                    type: {
                        type: string;
                    };
                };
            };
            StockQuote: {
                type: string;
                properties: {
                    symbol: {
                        type: string;
                    };
                    price: {
                        type: string;
                    };
                    open: {
                        type: string;
                    };
                    high: {
                        type: string;
                    };
                    low: {
                        type: string;
                    };
                    volume: {
                        type: string;
                    };
                    marketCap: {
                        type: string;
                    };
                    pe: {
                        type: string;
                    };
                };
            };
            HistoricalData: {
                type: string;
                properties: {
                    symbol: {
                        type: string;
                    };
                    timestamps: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    prices: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
            };
            ScreenerRequest: {
                type: string;
                properties: {
                    minMarketCap: {
                        type: string;
                    };
                    maxMarketCap: {
                        type: string;
                    };
                    minPE: {
                        type: string;
                    };
                    maxPE: {
                        type: string;
                    };
                    sector: {
                        type: string;
                    };
                };
            };
            TradingAgentRequest: {
                type: string;
                required: string[];
                properties: {
                    symbol: {
                        type: string;
                        example: string;
                    };
                    agent: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    deep_think_llm: {
                        type: string;
                        example: string;
                    };
                    quick_think_llm: {
                        type: string;
                        example: string;
                    };
                    max_debate_rounds: {
                        type: string;
                        example: number;
                    };
                };
            };
            TradingAgentResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                    };
                    symbol: {
                        type: string;
                    };
                    decision: {
                        type: string;
                        properties: {
                            action: {
                                type: string;
                                enum: string[];
                            };
                            confidence: {
                                type: string;
                                minimum: number;
                                maximum: number;
                            };
                            reasoning: {
                                type: string;
                            };
                            risk_assessment: {
                                type: string;
                            };
                        };
                    };
                    analysis: {
                        type: string;
                        properties: {
                            bull_arguments: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            bear_arguments: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            technical_indicators: {
                                type: string;
                            };
                            sentiment_score: {
                                type: string;
                            };
                        };
                    };
                };
            };
            DebateAnalysisResponse: {
                type: string;
                properties: {
                    decision: {
                        type: string;
                    };
                    confidence: {
                        type: string;
                    };
                    analysis: {
                        type: string;
                    };
                };
            };
            BacktestRequest: {
                type: string;
                required: string[];
                properties: {
                    symbol: {
                        type: string;
                        example: string;
                    };
                    printlog: {
                        type: string;
                        default: boolean;
                    };
                };
            };
            BacktestResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                    };
                    symbol: {
                        type: string;
                    };
                    primo_results: {
                        type: string;
                        properties: {
                            total_return: {
                                type: string;
                            };
                            sharpe_ratio: {
                                type: string;
                            };
                            max_drawdown: {
                                type: string;
                            };
                            win_rate: {
                                type: string;
                            };
                        };
                    };
                    buyhold_results: {
                        type: string;
                    };
                    comparison: {
                        type: string;
                    };
                };
            };
            Portfolio: {
                type: string;
                properties: {
                    totalEquity: {
                        type: string;
                    };
                    cash: {
                        type: string;
                    };
                    stocks: {
                        type: string;
                    };
                    dailyPnL: {
                        type: string;
                    };
                    dailyPnLPercent: {
                        type: string;
                    };
                    winRate: {
                        type: string;
                    };
                    openPositions: {
                        type: string;
                    };
                };
            };
            Strategy: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    type: {
                        type: string;
                        enum: string[];
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    riskLevel: {
                        type: string;
                        enum: string[];
                    };
                    todayPnL: {
                        type: string;
                    };
                    winRate: {
                        type: string;
                    };
                };
            };
            CreateStrategyRequest: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                    };
                    type: {
                        type: string;
                        enum: string[];
                    };
                    riskLevel: {
                        type: string;
                        enum: string[];
                    };
                };
            };
            UpdateStrategyRequest: {
                type: string;
                properties: {
                    status: {
                        type: string;
                        enum: string[];
                    };
                    config: {
                        type: string;
                    };
                };
            };
            Signal: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    asset: {
                        type: string;
                    };
                    type: {
                        type: string;
                    };
                    combinedScore: {
                        type: string;
                    };
                    scoreLabel: {
                        type: string;
                    };
                    fundamentalsScore: {
                        type: string;
                    };
                    technicalScore: {
                        type: string;
                    };
                    sentimentScore: {
                        type: string;
                    };
                    suggestedAction: {
                        type: string;
                    };
                };
            };
            StatisticsRequest: {
                type: string;
                properties: {
                    symbol: {
                        type: string;
                        example: string;
                    };
                    period: {
                        type: string;
                        default: string;
                    };
                    metrics: {
                        type: string;
                        items: {
                            type: string;
                            enum: string[];
                        };
                    };
                    window: {
                        type: string;
                        default: number;
                    };
                    correlation: {
                        type: string;
                        description: string;
                        properties: {
                            target: {
                                type: string;
                                example: string;
                                description: string;
                            };
                            features: {
                                type: string;
                                items: {
                                    type: string;
                                };
                                example: string[];
                                description: string;
                            };
                            method: {
                                type: string;
                                enum: string[];
                                default: string;
                            };
                        };
                    };
                };
            };
            StatisticsResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                    };
                    symbol: {
                        type: string;
                    };
                    data: {
                        type: string;
                        properties: {
                            timestamps: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            values: {
                                type: string;
                                additionalProperties: {
                                    type: string;
                                    items: {
                                        type: string;
                                    };
                                };
                            };
                            correlations: {
                                type: string;
                                description: string;
                                additionalProperties: {
                                    type: string;
                                };
                                example: {
                                    volume: number;
                                    sector_etf_price: number;
                                    market_index_price: number;
                                };
                            };
                        };
                    };
                };
            };
        };
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
            };
        };
    };
};
