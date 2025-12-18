# Alpaca Broker API Integration

Complete guide for using Alpaca Broker API with the Investment Prediction Agent platform.

## Table of Contents

1. [Setup](#setup)
2. [Account Creation](#account-creation)
3. [Trading Operations](#trading-operations)
4. [Portfolio Management](#portfolio-management)
5. [Real-Time Market Data](#real-time-market-data)
6. [JavaScript Examples](#javascript-examples)

## Setup

### Environment Variables

Add your Alpaca API credentials to `.env`:

```bash
# Trading API - For personal trading accounts
ALPACA_API_KEY=your_api_key_here
ALPACA_SECRET_KEY=your_secret_key_here
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# Broker API - For creating and managing end-user brokerage accounts
ALPACA_BROKER_API_KEY=your_broker_api_key
ALPACA_BROKER_SECRET_KEY=your_broker_secret_key
ALPACA_BROKER_BASE_URL=https://broker-api.alpaca.markets

# Market Data
ALPACA_DATA_FEED=iex  # or 'sip' for SIP data feed
```

### Get API Keys

1. **Trading API Keys**: https://app.alpaca.markets/paper/dashboard/overview
2. **Broker API Access**: https://alpaca.markets/broker
3. **Live Trading**: https://app.alpaca.markets/live/dashboard/overview

## Account Creation

### Create Brokerage Account

**Endpoint**: `POST /api/alpaca/broker/accounts`

Create a new brokerage account for an end user using the Broker API.

#### JavaScript Example

```javascript
async function createBrokerageAccount() {
  const accountData = {
    contact: {
      email_address: "user@example.com",
      phone_number: "+15551234567",
      street_address: ["123 Main St"],
      city: "San Francisco",
      state: "CA",
      postal_code: "94105",
      country: "USA"
    },
    identity: {
      given_name: "John",
      family_name: "Doe",
      date_of_birth: "1990-01-01",
      tax_id: "123-45-6789",
      tax_id_type: "USA_SSN",
      country_of_citizenship: "USA",
      country_of_birth: "USA",
      country_of_tax_residence: "USA",
      funding_source: ["employment_income"]
    },
    disclosures: {
      is_control_person: false,
      is_affiliated_exchange_or_finra: false,
      is_politically_exposed: false,
      immediate_family_exposed: false
    },
    ip_address: "192.168.1.1"
  };

  const response = await fetch('/api/alpaca/broker/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(accountData)
  });

  const result = await response.json();
  console.log('Account created:', result.account);
  // { id, status, account_number, created_at }
}
```

### Get Account Information

**Endpoint**: `GET /api/alpaca/account`

Get authenticated user's Alpaca account details including cash, equity, and buying power.

```javascript
async function getAccountInfo() {
  const response = await fetch('/api/alpaca/account');
  const data = await response.json();

  console.log('Cash:', data.account.cash);
  console.log('Equity:', data.account.equity);
  console.log('Buying Power:', data.account.buying_power);
  console.log('Portfolio Value:', data.account.portfolio_value);

  return data.account;
}
```

## Trading Operations

### Place Market Order

**Endpoint**: `POST /api/alpaca/orders`

```javascript
async function placeMarketOrder(symbol, quantity, side = 'buy') {
  const orderData = {
    symbol: symbol,
    qty: quantity.toString(),
    side: side,
    type: 'market',
    time_in_force: 'day'
  };

  const response = await fetch('/api/alpaca/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  });

  const result = await response.json();
  console.log('Order placed:', result.order);
  return result.order;
}

// Example: Buy 10 shares of AAPL
placeMarketOrder('AAPL', 10, 'buy');
```

### Place Limit Order

```javascript
async function placeLimitOrder(symbol, quantity, limitPrice, side = 'buy') {
  const orderData = {
    symbol: symbol,
    qty: quantity.toString(),
    side: side,
    type: 'limit',
    time_in_force: 'gtc',  // Good till cancelled
    limit_price: limitPrice.toString()
  };

  const response = await fetch('/api/alpaca/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  });

  const result = await response.json();
  return result.order;
}

// Example: Buy 5 shares of TSLA at $250.50
placeLimitOrder('TSLA', 5, 250.50, 'buy');
```

### Place Bracket Order (Stop Loss + Take Profit)

```javascript
async function placeBracketOrder(symbol, quantity, limitPrice, stopLoss, takeProfit) {
  const orderData = {
    symbol: symbol,
    qty: quantity.toString(),
    side: 'buy',
    type: 'limit',
    time_in_force: 'gtc',
    limit_price: limitPrice.toString(),
    order_class: 'bracket',
    stop_loss: {
      stop_price: stopLoss.toString()
    },
    take_profit: {
      limit_price: takeProfit.toString()
    }
  };

  const response = await fetch('/api/alpaca/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  });

  const result = await response.json();
  return result.order;
}

// Example: Buy NVDA with stop loss and take profit
placeBracketOrder('NVDA', 2, 500.00, 480.00, 520.00);
```

### Get Orders

**Endpoint**: `GET /api/alpaca/orders?status=all&limit=50`

```javascript
async function getOrders(status = 'all', limit = 50) {
  const response = await fetch(
    `/api/alpaca/orders?status=${status}&limit=${limit}`
  );
  const data = await response.json();

  console.log('Orders:', data.orders);
  return data.orders;
}

// Get all orders
getOrders('all');

// Get only open orders
getOrders('open');
```

### Cancel Order

**Endpoint**: `DELETE /api/alpaca/orders?id={order_id}`

```javascript
async function cancelOrder(orderId) {
  const response = await fetch(`/api/alpaca/orders?id=${orderId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log(result.message);
}

// Cancel all orders
async function cancelAllOrders() {
  const response = await fetch('/api/alpaca/orders', {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log(result.message);
}
```

## Portfolio Management

### Get Positions

**Endpoint**: `GET /api/alpaca/positions`

```javascript
async function getPositions() {
  const response = await fetch('/api/alpaca/positions');
  const data = await response.json();

  data.positions.forEach(position => {
    console.log(`${position.symbol}:`);
    console.log(`  Quantity: ${position.qty}`);
    console.log(`  Market Value: $${position.market_value}`);
    console.log(`  Cost Basis: $${position.cost_basis}`);
    console.log(`  Unrealized P/L: $${position.unrealized_pl} (${position.unrealized_plpc}%)`);
    console.log(`  Current Price: $${position.current_price}`);
  });

  return data.positions;
}
```

### Close Position

**Endpoint**: `DELETE /api/alpaca/positions?symbol={symbol}`

```javascript
async function closePosition(symbol) {
  const response = await fetch(`/api/alpaca/positions?symbol=${symbol}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log(result.message);
}

// Close specific position
closePosition('AAPL');

// Close all positions
async function closeAllPositions() {
  const response = await fetch('/api/alpaca/positions', {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log(result.message);
}
```

### Get Portfolio History

**Endpoint**: `GET /api/alpaca/portfolio-history?period=1M&timeframe=1D`

```javascript
async function getPortfolioHistory(period = '1M', timeframe = '1D') {
  const response = await fetch(
    `/api/alpaca/portfolio-history?period=${period}&timeframe=${timeframe}`
  );
  const data = await response.json();

  const history = data.history;
  console.log('Portfolio History:');
  console.log('Timestamps:', history.timestamp);
  console.log('Equity:', history.equity);
  console.log('P/L:', history.profit_loss);
  console.log('P/L %:', history.profit_loss_pct);

  return history;
}

// Get 1 month history with daily data points
getPortfolioHistory('1M', '1D');

// Get 1 year history with weekly data points
getPortfolioHistory('1Y', '1W');
```

### Get Tradable Assets

**Endpoint**: `GET /api/alpaca/assets?status=active&asset_class=us_equity`

```javascript
async function getTradableAssets(assetClass = 'us_equity') {
  const response = await fetch(
    `/api/alpaca/assets?status=active&asset_class=${assetClass}`
  );
  const data = await response.json();

  console.log(`Found ${data.assets.length} tradable assets`);
  return data.assets;
}
```

### Manage Watchlists

**Endpoints**:
- `GET /api/alpaca/watchlist` - Get all watchlists
- `POST /api/alpaca/watchlist` - Create watchlist
- `DELETE /api/alpaca/watchlist?id={id}` - Delete watchlist

```javascript
// Get all watchlists
async function getWatchlists() {
  const response = await fetch('/api/alpaca/watchlist');
  const data = await response.json();
  return data.watchlists;
}

// Create watchlist
async function createWatchlist(name, symbols) {
  const response = await fetch('/api/alpaca/watchlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      symbols: symbols
    })
  });

  const result = await response.json();
  return result;
}

// Example: Create a tech stocks watchlist
createWatchlist('My Tech Stocks', ['AAPL', 'TSLA', 'NVDA', 'MSFT']);

// Delete watchlist
async function deleteWatchlist(watchlistId) {
  const response = await fetch(`/api/alpaca/watchlist?id=${watchlistId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log(result.message);
}
```

## Real-Time Market Data

### Get WebSocket Connection Info

**Endpoint**: `GET /api/alpaca/stream`

```javascript
async function getStreamInfo() {
  const response = await fetch('/api/alpaca/stream');
  const data = await response.json();

  console.log('WebSocket URL:', data.connection.websocket_url);
  console.log('Data Feed:', data.connection.feed);
  console.log('Supported Channels:', data.supported_channels);

  return data;
}
```

### Subscribe to Real-Time Data (Client-Side WebSocket)

```javascript
// Get connection info first
const streamInfo = await getStreamInfo();

// Connect to WebSocket
const ws = new WebSocket(streamInfo.connection.websocket_url);

ws.onopen = () => {
  console.log('Connected to Alpaca data stream');

  // Authenticate
  ws.send(JSON.stringify({
    action: 'auth',
    key: YOUR_API_KEY,
    secret: YOUR_SECRET_KEY
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message[0]?.T === 'success' && message[0]?.msg === 'authenticated') {
    console.log('Authenticated successfully');

    // Subscribe to trades for AAPL and TSLA
    ws.send(JSON.stringify({
      action: 'subscribe',
      trades: ['AAPL', 'TSLA'],
      quotes: ['AAPL'],
      bars: ['TSLA']
    }));
  }

  // Handle trade updates
  if (message[0]?.T === 't') {  // Trade
    console.log('Trade:', {
      symbol: message[0].S,
      price: message[0].p,
      size: message[0].s,
      timestamp: message[0].t
    });
  }

  // Handle quote updates
  if (message[0]?.T === 'q') {  // Quote
    console.log('Quote:', {
      symbol: message[0].S,
      bid: message[0].bp,
      ask: message[0].ap,
      bidSize: message[0].bs,
      askSize: message[0].as
    });
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from stream');
};

// Unsubscribe from symbols
function unsubscribe(symbols) {
  ws.send(JSON.stringify({
    action: 'unsubscribe',
    trades: symbols
  }));
}
```

### Get Real-Time Snapshots (HTTP Alternative)

**Endpoint**: `POST /api/alpaca/stream/snapshot`

```javascript
async function getSnapshots(symbols) {
  const response = await fetch('/api/alpaca/stream/snapshot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symbols: symbols
    })
  });

  const data = await response.json();

  // Snapshots include latest trade, quote, and daily bar
  console.log('Snapshots:', data.snapshots);
  return data.snapshots;
}

// Get current data for multiple symbols
getSnapshots(['AAPL', 'TSLA', 'NVDA']);
```

## Complete Trading Flow Example

Here's a complete example that combines account info, order placement, and position management:

```javascript
async function completeTradingFlow() {
  try {
    // 1. Get account information
    console.log('=== Account Info ===');
    const account = await getAccountInfo();
    console.log(`Cash: $${account.cash}`);
    console.log(`Buying Power: $${account.buying_power}`);

    // 2. Get current positions
    console.log('\n=== Current Positions ===');
    const positions = await getPositions();

    // 3. Place a bracket order
    console.log('\n=== Placing Order ===');
    const order = await placeBracketOrder(
      'AAPL',    // symbol
      10,        // quantity
      150.00,    // limit price
      145.00,    // stop loss
      160.00     // take profit
    );
    console.log('Order ID:', order.id);
    console.log('Status:', order.status);

    // 4. Get all orders
    console.log('\n=== All Orders ===');
    const orders = await getOrders('all', 10);
    orders.forEach(o => {
      console.log(`${o.symbol}: ${o.side} ${o.qty} @ ${o.type} - ${o.status}`);
    });

    // 5. Get portfolio history
    console.log('\n=== Portfolio Performance ===');
    const history = await getPortfolioHistory('1M', '1D');
    const totalReturn = history.profit_loss[history.profit_loss.length - 1];
    const totalReturnPct = history.profit_loss_pct[history.profit_loss_pct.length - 1];
    console.log(`Total Return: $${totalReturn} (${totalReturnPct}%)`);

  } catch (error) {
    console.error('Error in trading flow:', error);
  }
}

// Run the complete flow
completeTradingFlow();
```

## Error Handling

Always wrap API calls in try-catch blocks:

```javascript
async function safeApiCall() {
  try {
    const response = await fetch('/api/alpaca/account');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('API Error:', error.message);
    // Handle error appropriately
    if (error.message.includes('Unauthorized')) {
      // Redirect to login
    } else if (error.message.includes('keys not configured')) {
      // Show settings page
    }
  }
}
```

## API Documentation

For complete API documentation with all endpoints and schemas, visit:

- **Interactive API Docs**: `/api/docs` (Scalar UI)
- **OpenAPI Spec**: `/api/openapi.json`

## Resources

- [Alpaca Trading API Docs](https://docs.alpaca.markets/docs/trading-api)
- [Alpaca Broker API Docs](https://docs.alpaca.markets/docs/broker-api)
- [Alpaca Market Data API](https://docs.alpaca.markets/docs/market-data-api)
- [Alpaca JavaScript Library](https://github.com/alpacahq/alpaca-trade-api-js)

## Support

For issues or questions:
- GitHub Issues: https://github.com/vtempest/investment-prediction-agent/issues
- Alpaca Support: support@alpaca.markets
