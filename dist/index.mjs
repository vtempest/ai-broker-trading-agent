import { createAuthClient as De } from "better-auth/react";
import { siweClient as Le, oneTapClient as Ce } from "better-auth/client/plugins";
import { betterAuth as Me } from "better-auth";
import { siwe as Ie } from "better-auth/plugins";
import { drizzleAdapter as Re } from "better-auth/adapters/drizzle";
import { createClient as $e } from "@libsql/client";
import { drizzle as Oe } from "drizzle-orm/libsql";
import { sqliteTable as f, integer as c, text as o, real as m } from "drizzle-orm/sqlite-core";
import { randomBytes as Ee } from "crypto";
import { verifyMessage as xe } from "ethers";
import { clsx as ze } from "clsx";
import { twMerge as Ue } from "tailwind-merge";
import { yfinance as Fe } from "@/lib/stocks/yfinance-wrapper";
import F from "axios";
import se from "node:fs";
import Be from "node:path";
import je from "@alpacahq/alpaca-trade-api";
import { log as qe, grab as We } from "grab-url";
import Ke from "fs/promises";
import { db as w } from "@/lib/db";
import { zuluTraders as T, zuluCurrencyStats as V, polymarketLeaders as $, polymarketPositions as H, polymarketCategories as U, polymarketMarkets as C, polymarketMarketPositions as E, polymarketDebates as J } from "@/lib/db/schema";
import { desc as x, eq as R, asc as ue, sql as te } from "drizzle-orm";
import { TavilyClient as Ve } from "tavily";
import { ChatGroq as He } from "@langchain/groq";
import I from "fs";
import Je from "yahoo-finance2";
const Ge = De({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || (typeof window < "u" ? window.location.origin : "http://localhost:3000"),
  plugins: [
    Le(),
    Ce({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    })
  ]
}), { useSession: ss, signIn: ns, signOut: rs } = Ge, v = f("users", {
  id: o("id").primaryKey(),
  name: o("name").notNull(),
  email: o("email").notNull().unique(),
  emailVerified: c("email_verified", { mode: "boolean" }).default(!1),
  image: o("image"),
  apiKey: o("api_key").unique(),
  usageCount: c("usage_count").default(0),
  alpacaKeyId: o("alpaca_key_id"),
  alpacaSecretKey: o("alpaca_secret_key"),
  alpacaPaper: c("alpaca_paper", { mode: "boolean" }).default(!0),
  surveyResponse: o("survey_response"),
  // JSON string of survey responses
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), me = f("sessions", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  expiresAt: c("expires_at", { mode: "timestamp" }).notNull(),
  token: o("token").notNull().unique(),
  ipAddress: o("ip_address"),
  userAgent: o("user_agent"),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), pe = f("accounts", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  accountId: o("account_id").notNull(),
  providerId: o("provider_id").notNull(),
  accessToken: o("access_token"),
  refreshToken: o("refresh_token"),
  idToken: o("id_token"),
  expiresAt: c("expires_at", { mode: "timestamp" }),
  accessTokenExpiresAt: c("access_token_expires_at", { mode: "timestamp" }),
  scope: o("scope"),
  password: o("password"),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), ye = f("verifications", {
  id: o("id").primaryKey(),
  identifier: o("identifier").notNull(),
  value: o("value").notNull(),
  expiresAt: c("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: c("created_at", { mode: "timestamp" }),
  updatedAt: c("updated_at", { mode: "timestamp" })
}), Ye = f("wallet_addresses", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  walletAddress: o("wallet_address").notNull().unique(),
  chainId: c("chain_id"),
  isPrimary: c("is_primary", { mode: "boolean" }).default(!1),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), Ze = f("user_settings", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }).unique(),
  // LLM Provider API Keys
  groqApiKey: o("groq_api_key"),
  openaiApiKey: o("openai_api_key"),
  anthropicApiKey: o("anthropic_api_key"),
  xaiApiKey: o("xai_api_key"),
  googleApiKey: o("google_api_key"),
  togetheraiApiKey: o("togetherai_api_key"),
  perplexityApiKey: o("perplexity_api_key"),
  cloudflareApiKey: o("cloudflare_api_key"),
  // Broker API Keys
  alpacaApiKey: o("alpaca_api_key"),
  alpacaApiSecret: o("alpaca_api_secret"),
  alpacaBaseUrl: o("alpaca_base_url"),
  // Broker Credentials
  webullUsername: o("webull_username"),
  webullPassword: o("webull_password"),
  robinhoodUsername: o("robinhood_username"),
  robinhoodPassword: o("robinhood_password"),
  ibkrUsername: o("ibkr_username"),
  ibkrPassword: o("ibkr_password"),
  // Data Provider API Keys
  alphaVantageApiKey: o("alpha_vantage_api_key"),
  finnhubApiKey: o("finnhub_api_key"),
  polygonApiKey: o("polygon_api_key"),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), Xe = f("strategies", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  name: o("name").notNull(),
  type: o("type").notNull(),
  // momentum, mean-reversion, breakout, day-scalp
  status: o("status").notNull().default("paused"),
  // running, paused, paper
  riskLevel: o("risk_level").notNull().default("medium"),
  // Performance metrics
  todayPnL: m("today_pnl").default(0),
  last7DaysPnL: m("last_7days_pnl").default(0),
  last30DaysPnL: m("last_30days_pnl").default(0),
  winRate: m("win_rate").default(0),
  activeMarkets: c("active_markets").default(0),
  tradesToday: c("trades_today").default(0),
  // Configuration
  config: o("config"),
  // JSON string of strategy parameters
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), ge = f("watchlists", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  name: o("name").notNull(),
  description: o("description"),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), Qe = f("watchlist", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  watchlistId: o("watchlist_id").references(() => ge.id, { onDelete: "cascade" }),
  // Nullable (NULL = Default/Favorites)
  symbol: o("symbol").notNull(),
  name: o("name"),
  // Stock name (optional)
  addedAt: c("added_at", { mode: "timestamp" }).notNull()
}), et = f("signals", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  asset: o("asset").notNull(),
  type: o("type").notNull(),
  // stock, prediction_market
  // Scores
  combinedScore: m("combined_score").notNull(),
  scoreLabel: o("score_label").notNull(),
  // Strong Buy, Buy, Hold, Sell, Strong Sell
  // Driver scores
  fundamentalsScore: m("fundamentals_score"),
  vixScore: m("vix_score"),
  technicalScore: m("technical_score"),
  sentimentScore: m("sentiment_score"),
  // Metadata
  strategy: o("strategy"),
  timeframe: o("timeframe"),
  suggestedAction: o("suggested_action"),
  suggestedSize: o("suggested_size"),
  // Additional data
  metadata: o("metadata"),
  // JSON string with extra data
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), tt = f("positions", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  asset: o("asset").notNull(),
  type: o("type").notNull(),
  // stock, prediction_market
  entryPrice: m("entry_price").notNull(),
  currentPrice: m("current_price").notNull(),
  size: m("size").notNull(),
  unrealizedPnL: m("unrealized_pnl").default(0),
  unrealizedPnLPercent: m("unrealized_pnl_percent").default(0),
  strategy: o("strategy"),
  openedBy: o("opened_by"),
  openedAt: c("opened_at", { mode: "timestamp" }).notNull(),
  closedAt: c("closed_at", { mode: "timestamp" }),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), at = f("trades", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  asset: o("asset").notNull(),
  type: o("type").notNull(),
  // stock, prediction_market
  action: o("action").notNull(),
  // buy, sell
  price: m("price").notNull(),
  size: m("size").notNull(),
  pnl: m("pnl"),
  strategy: o("strategy"),
  copiedFrom: o("copied_from"),
  timestamp: c("timestamp", { mode: "timestamp" }).notNull(),
  createdAt: c("created_at", { mode: "timestamp" }).notNull()
}), st = f("portfolios", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }).unique(),
  totalEquity: m("total_equity").default(1e5),
  cash: m("cash").default(1e5),
  stocks: m("stocks").default(0),
  predictionMarkets: m("prediction_markets").default(0),
  margin: m("margin").default(0),
  dailyPnL: m("daily_pnl").default(0),
  dailyPnLPercent: m("daily_pnl_percent").default(0),
  winRate: m("win_rate").default(0),
  openPositions: c("open_positions").default(0),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), nt = f("polymarket_leaders", {
  trader: o("trader").primaryKey(),
  rank: c("rank"),
  userName: o("user_name"),
  xUsername: o("x_username"),
  verifiedBadge: c("verified_badge", { mode: "boolean" }),
  profileImage: o("profile_image"),
  // Volume and PnL from new leaderboard API
  vol: m("vol"),
  pnl: m("pnl"),
  // Legacy fields from old API (keep for backward compatibility)
  overallGain: m("overall_gain"),
  winRate: m("win_rate"),
  activePositions: c("active_positions"),
  totalPositions: c("total_positions"),
  currentValue: m("current_value"),
  winAmount: m("win_amount"),
  lossAmount: m("loss_amount"),
  updatedAt: c("updated_at", { mode: "timestamp" })
}), rt = f("polymarket_positions", {
  id: o("id").primaryKey(),
  traderId: o("trader_id").notNull(),
  marketId: o("market_id"),
  marketTitle: o("market_title"),
  cashPnl: m("cash_pnl"),
  realizedPnl: m("realized_pnl"),
  tags: o("tags"),
  // JSON array
  createdAt: c("created_at", { mode: "timestamp" })
}), ot = f("polymarket_categories", {
  tag: o("tag").primaryKey(),
  pnl: m("pnl"),
  updatedAt: c("updated_at", { mode: "timestamp" })
}), it = f("polymarket_markets", {
  id: o("id").primaryKey(),
  question: o("question").notNull(),
  slug: o("slug").notNull(),
  description: o("description"),
  image: o("image"),
  // Volume metrics
  volume24hr: m("volume_24hr"),
  volumeTotal: m("volume_total"),
  // Market status
  active: c("active", { mode: "boolean" }).default(!0),
  closed: c("closed", { mode: "boolean" }).default(!1),
  // Outcomes and prices (stored as JSON strings)
  outcomes: o("outcomes").notNull(),
  // JSON array: ["Yes", "No"]
  outcomePrices: o("outcome_prices").notNull(),
  // JSON array: ["0.65", "0.35"]
  // Additional metadata
  tags: o("tags"),
  // JSON array
  endDate: o("end_date"),
  groupItemTitle: o("group_item_title"),
  enableOrderBook: c("enable_order_book", { mode: "boolean" }),
  // Tracking
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), lt = f("polymarket_market_positions", {
  id: o("id").primaryKey(),
  marketId: o("market_id").notNull(),
  outcome: o("outcome").notNull(),
  // "Yes" or "No"
  price: m("price").notNull(),
  size: m("size").notNull(),
  side: o("side").notNull(),
  // "buy" or "sell"
  totalValue: m("total_value").notNull(),
  createdAt: c("created_at", { mode: "timestamp" }).notNull()
}), ct = f("polymarket_debates", {
  id: o("id").primaryKey(),
  marketId: o("market_id").notNull().unique(),
  question: o("question").notNull(),
  // Debate arguments
  yesArguments: o("yes_arguments").notNull(),
  // JSON array of arguments
  noArguments: o("no_arguments").notNull(),
  // JSON array of arguments
  // Analysis
  yesSummary: o("yes_summary").notNull(),
  noSummary: o("no_summary").notNull(),
  keyFactors: o("key_factors").notNull(),
  // JSON array
  uncertainties: o("uncertainties").notNull(),
  // JSON array
  // Metadata
  currentYesPrice: m("current_yes_price"),
  currentNoPrice: m("current_no_price"),
  llmProvider: o("llm_provider"),
  model: o("model"),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), dt = f("zulu_traders", {
  providerId: c("provider_id").primaryKey(),
  name: o("name"),
  strategyDesc: o("strategy_desc"),
  countryCode: o("country_code"),
  countryName: o("country_name"),
  brokerName: o("broker_name"),
  balance: m("balance"),
  equity: m("equity"),
  followers: c("followers"),
  liveFollowers: c("live_followers"),
  roiAnnualized: m("roi_annualized"),
  roiProfit: m("roi_profit"),
  zuluRank: c("zulu_rank"),
  bestTrade: m("best_trade"),
  worstTrade: m("worst_trade"),
  profitableTrades: c("profitable_trades"),
  losingTrades: c("losing_trades"),
  avgDrawdown: m("avg_drawdown"),
  maxDrawdown: m("max_drawdown"),
  maxDrawdownPercent: m("max_drawdown_percent"),
  leverage: m("leverage"),
  isEa: c("is_ea"),
  // 1 for EA (Expert Advisor), 0 for manual
  currencies: o("currencies"),
  weeks: c("weeks"),
  demo: c("demo"),
  // 1 for demo, 0 for live
  avgTradeSeconds: c("avg_trade_seconds"),
  avgPnlPerTrade: m("avg_pnl_per_trade"),
  winRate: m("win_rate"),
  totalTrades: c("total_trades"),
  pageVisits: c("page_visits"),
  includedInWatchlist: c("included_in_watchlist"),
  registrationDate: c("registration_date", { mode: "timestamp" }),
  lastOpenTradeDate: c("last_open_trade_date", { mode: "timestamp" }),
  updatedAt: c("updated_at", { mode: "timestamp" })
}), ut = f("zulu_currency_stats", {
  id: o("id").primaryKey(),
  providerId: c("provider_id").notNull(),
  currencyName: o("currency_name"),
  totalCount: c("total_count"),
  winCount: c("win_count"),
  winPercent: m("win_percent"),
  totalBuyCount: c("total_buy_count"),
  totalSellCount: c("total_sell_count"),
  pips: m("pips"),
  createdAt: c("created_at", { mode: "timestamp" })
}), mt = f("agent_api_logs", {
  id: o("id").primaryKey(),
  userId: o("user_id").references(() => v.id, { onDelete: "set null" }),
  // Optional, linking to user if authenticated
  symbol: o("symbol").notNull(),
  requestPayload: o("request_payload"),
  // JSON string
  responseSignal: o("response_signal"),
  // JSON string
  responseAnalysis: o("response_analysis"),
  // JSON string
  llmProvider: o("llm_provider"),
  model: o("model_used"),
  timestamp: c("timestamp", { mode: "timestamp" }).notNull(),
  createdAt: c("created_at", { mode: "timestamp" }).notNull()
}), Q = f("organizations", {
  id: o("id").primaryKey(),
  name: o("name").notNull(),
  description: o("description"),
  image: o("image"),
  ownerId: o("owner_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), pt = f("organization_members", {
  id: o("id").primaryKey(),
  organizationId: o("organization_id").notNull().references(() => Q.id, { onDelete: "cascade" }),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  role: o("role").notNull().default("member"),
  // owner, admin, member
  joinedAt: c("joined_at", { mode: "timestamp" }).notNull()
}), re = f("teams", {
  id: o("id").primaryKey(),
  organizationId: o("organization_id").notNull().references(() => Q.id, { onDelete: "cascade" }),
  name: o("name").notNull(),
  description: o("description"),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), yt = f("team_members", {
  id: o("id").primaryKey(),
  teamId: o("team_id").notNull().references(() => re.id, { onDelete: "cascade" }),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  role: o("role").notNull().default("member"),
  // lead, member
  joinedAt: c("joined_at", { mode: "timestamp" }).notNull()
}), gt = f("user_follows", {
  id: o("id").primaryKey(),
  followerId: o("follower_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  followingId: o("following_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  createdAt: c("created_at", { mode: "timestamp" }).notNull()
}), ht = f("user_invitations", {
  id: o("id").primaryKey(),
  inviterId: o("inviter_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  email: o("email").notNull(),
  status: o("status").notNull().default("pending"),
  // pending, accepted, expired
  organizationId: o("organization_id").references(() => Q.id, { onDelete: "cascade" }),
  teamId: o("team_id").references(() => re.id, { onDelete: "cascade" }),
  expiresAt: c("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: c("created_at", { mode: "timestamp" }).notNull()
}), ft = f("shared_items", {
  id: o("id").primaryKey(),
  sharedById: o("shared_by_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  sharedWithEmail: o("shared_with_email").notNull(),
  sharedWithUserId: o("shared_with_user_id").references(() => v.id, { onDelete: "set null" }),
  itemType: o("item_type").notNull(),
  // stock_alert, debate_report, signal, strategy
  itemId: o("item_id").notNull(),
  // Reference to the shared item
  symbol: o("symbol"),
  // For stock-related shares
  title: o("title"),
  message: o("message"),
  // Optional message from sender
  metadata: o("metadata"),
  // JSON string with additional data
  viewedAt: c("viewed_at", { mode: "timestamp" }),
  createdAt: c("created_at", { mode: "timestamp" }).notNull()
}), wt = f("notifications", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  type: o("type").notNull(),
  // share, follow, invite, comment, like, mention
  title: o("title").notNull(),
  message: o("message").notNull(),
  actionUrl: o("action_url"),
  // Link to the relevant item
  fromUserId: o("from_user_id").references(() => v.id, { onDelete: "cascade" }),
  relatedItemType: o("related_item_type"),
  // stock_alert, debate_report, comment, etc.
  relatedItemId: o("related_item_id"),
  read: c("read", { mode: "boolean" }).default(!1),
  createdAt: c("created_at", { mode: "timestamp" }).notNull()
}), he = f("comments", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  itemType: o("item_type").notNull(),
  // debate_report, news_tip, signal, strategy
  itemId: o("item_id").notNull(),
  // ID of the item being commented on
  parentCommentId: o("parent_comment_id").references(() => he.id, { onDelete: "cascade" }),
  // For nested comments
  content: o("content").notNull(),
  editedAt: c("edited_at", { mode: "timestamp" }),
  createdAt: c("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: c("updated_at", { mode: "timestamp" }).notNull()
}), vt = f("likes", {
  id: o("id").primaryKey(),
  userId: o("user_id").notNull().references(() => v.id, { onDelete: "cascade" }),
  itemType: o("item_type").notNull(),
  // debate_report, news_tip, signal, strategy, comment
  itemId: o("item_id").notNull(),
  // ID of the item being liked
  createdAt: c("created_at", { mode: "timestamp" }).notNull()
}), kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accounts: pe,
  agentApiLogs: mt,
  comments: he,
  likes: vt,
  notifications: wt,
  organizationMembers: pt,
  organizations: Q,
  polymarketCategories: ot,
  polymarketDebates: ct,
  polymarketLeaders: nt,
  polymarketMarketPositions: lt,
  polymarketMarkets: it,
  polymarketPositions: rt,
  portfolios: st,
  positions: tt,
  sessions: me,
  sharedItems: ft,
  signals: et,
  strategies: Xe,
  teamMembers: yt,
  teams: re,
  trades: at,
  userFollows: gt,
  userInvitations: ht,
  userSettings: Ze,
  users: v,
  verifications: ye,
  walletAddresses: Ye,
  watchlist: Qe,
  watchlists: ge,
  zuluCurrencyStats: ut,
  zuluTraders: dt
}, Symbol.toStringTag, { value: "Module" })), _t = $e({
  url: process.env.DATABASE_URL || "file:./local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN
}), bt = Oe(_t, { schema: kt }), os = Me({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // basePath: "/api/auth", // better-auth defaults to this, but keeping it explicit if user wants
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "your-secret-key",
  database: Re(bt, {
    provider: "sqlite",
    schema: {
      user: v,
      session: me,
      account: pe,
      verification: ye
    }
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }
  },
  plugins: [
    Ie({
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000",
      anonymous: !1,
      // Require email for non-anonymous users
      getNonce: async () => Ee(32).toString("hex"),
      verifyMessage: async ({ message: a, signature: e, chainId: t }) => {
        try {
          const s = xe(a, e);
          return t && t !== 1 && t !== 11155111 && t !== 31337 && console.warn(`Unsupported chain ID: ${t}`), !!s;
        } catch (s) {
          return console.error("Message verification failed:", s), !1;
        }
      }
    })
  ],
  emailAndPassword: {
    enabled: !0,
    minPasswordLength: 8
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ],
  session: {
    expiresIn: 3600 * 24 * 60,
    // 60 days
    updateAge: 3600 * 24 * 3
    // 1 day
  }
}), is = "TimeTravel", ls = "support@timetravel.investments", cs = "2025-12-16", ds = {
  totalEquity: 524750,
  dailyPnL: 8420,
  dailyPnLPercent: 1.63,
  winRate: 64.2,
  openPositions: 18,
  cash: 125e3,
  margin: 75e3,
  stocks: 35e4,
  predictionMarkets: 49750
}, us = [
  // Buy and Hold
  {
    id: "buy-hold",
    name: "Buy Hold",
    description: "Simple buy and hold strategy for long-term investment",
    todayPnL: 1200,
    last7DaysPnL: 8500,
    last30DaysPnL: 32400,
    winRate: 65,
    activeMarkets: 10,
    tradesToday: 0,
    status: "running",
    timeframe: "Long-term",
    riskLevel: "low",
    bestConditions: "Bullish markets, stable growth",
    avoidWhen: "Bear markets, high volatility"
  },
  // Momentum Strategies
  {
    id: "awesome-oscillator",
    name: "Awesome Oscillator",
    description: "Measures market momentum using 5-34 period simple moving averages",
    todayPnL: 2340,
    last7DaysPnL: 11200,
    last30DaysPnL: 38900,
    winRate: 56.8,
    activeMarkets: 8,
    tradesToday: 6,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Trending markets, clear momentum",
    avoidWhen: "Choppy markets, low volatility"
  },
  {
    id: "rsi-2",
    name: "RSI 2",
    description: "Short-term mean reversion using 2-period RSI for extreme readings",
    todayPnL: 1890,
    last7DaysPnL: 9400,
    last30DaysPnL: 41200,
    winRate: 62.3,
    activeMarkets: 12,
    tradesToday: 8,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Range-bound markets, mean reversion",
    avoidWhen: "Strong trending markets"
  },
  {
    id: "ichimoku-cloud",
    name: "Ichimoku Cloud",
    description: "Japanese technical system showing support, resistance, momentum and trend",
    todayPnL: 3120,
    last7DaysPnL: 14500,
    last30DaysPnL: 52300,
    winRate: 58.9,
    activeMarkets: 9,
    tradesToday: 5,
    status: "running",
    timeframe: "Daily to Weekly",
    riskLevel: "medium",
    bestConditions: "Clear trends, trending markets",
    avoidWhen: "Choppy, sideways markets"
  },
  {
    id: "stochastic-oscillator",
    name: "Stochastic Oscillator",
    description: "Momentum indicator comparing closing price to price range over time",
    todayPnL: 1560,
    last7DaysPnL: 7800,
    last30DaysPnL: 29400,
    winRate: 54.2,
    activeMarkets: 10,
    tradesToday: 7,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Overbought/oversold conditions",
    avoidWhen: "Strong trending markets"
  },
  {
    id: "williams-r",
    name: "Williams R",
    description: "Momentum indicator showing overbought/oversold levels",
    todayPnL: 980,
    last7DaysPnL: 5600,
    last30DaysPnL: 22100,
    winRate: 52.8,
    activeMarkets: 7,
    tradesToday: 4,
    status: "running",
    timeframe: "Daily",
    riskLevel: "low",
    bestConditions: "Range-bound markets",
    avoidWhen: "Strong trends"
  },
  // Trend Strategies
  {
    id: "apo",
    name: "Absolute Price Oscillator (APO)",
    description: "Difference between two moving averages expressed as absolute value",
    todayPnL: 2100,
    last7DaysPnL: 10200,
    last30DaysPnL: 38700,
    winRate: 55.4,
    activeMarkets: 11,
    tradesToday: 6,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Trending markets",
    avoidWhen: "Sideways markets"
  },
  {
    id: "aroon",
    name: "Aroon Strategy",
    description: "Identifies trend changes and strength using Aroon up/down indicators",
    todayPnL: 1740,
    last7DaysPnL: 8900,
    last30DaysPnL: 35600,
    winRate: 57.1,
    activeMarkets: 9,
    tradesToday: 5,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "New trends forming",
    avoidWhen: "Consolidation periods"
  },
  {
    id: "bop",
    name: "Balance of Power (BOM)",
    description: "Measures buying and selling pressure in the market",
    todayPnL: 1420,
    last7DaysPnL: 6800,
    last30DaysPnL: 28300,
    winRate: 53.6,
    activeMarkets: 8,
    tradesToday: 4,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Strong directional moves",
    avoidWhen: "Low volume, sideways"
  },
  {
    id: "cfo",
    name: "Chande Forecast Oscillator (CFO)",
    description: "Percentage difference between actual and forecasted price",
    todayPnL: 890,
    last7DaysPnL: 4500,
    last30DaysPnL: 19800,
    winRate: 51.2,
    activeMarkets: 6,
    tradesToday: 3,
    status: "paper",
    timeframe: "Daily",
    riskLevel: "low",
    bestConditions: "Trend following",
    avoidWhen: "Erratic price action"
  },
  {
    id: "kdj",
    name: "KDJ Strategy",
    description: "Enhanced stochastic indicator with J line for earlier signals",
    todayPnL: 2680,
    last7DaysPnL: 12100,
    last30DaysPnL: 46200,
    winRate: 59.4,
    activeMarkets: 10,
    tradesToday: 7,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Trending with pullbacks",
    avoidWhen: "Choppy markets"
  },
  {
    id: "macd",
    name: "MACD Strategy",
    description: "Moving Average Convergence Divergence for trend and momentum",
    todayPnL: 3450,
    last7DaysPnL: 15800,
    last30DaysPnL: 58400,
    winRate: 61.2,
    activeMarkets: 14,
    tradesToday: 9,
    status: "running",
    timeframe: "Daily to Weekly",
    riskLevel: "medium",
    bestConditions: "Clear trends, momentum shifts",
    avoidWhen: "Sideways, low volatility"
  },
  {
    id: "psar",
    name: "Parabolic SAR",
    description: "Stop and Reverse system for trailing stops and trend reversals",
    todayPnL: 2230,
    last7DaysPnL: 10800,
    last30DaysPnL: 42500,
    winRate: 56.7,
    activeMarkets: 11,
    tradesToday: 6,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Strong trending markets",
    avoidWhen: "Choppy, ranging markets"
  },
  {
    id: "typical-price",
    name: "Typical Price",
    description: "Uses average of high, low, and close for trend identification",
    todayPnL: 1150,
    last7DaysPnL: 5900,
    last30DaysPnL: 24700,
    winRate: 52.9,
    activeMarkets: 7,
    tradesToday: 4,
    status: "paper",
    timeframe: "Daily",
    riskLevel: "low",
    bestConditions: "Stable trends",
    avoidWhen: "Volatile markets"
  },
  {
    id: "vortex",
    name: "Vortex Strategy",
    description: "Identifies trend starts and direction using positive/negative movement",
    todayPnL: 1890,
    last7DaysPnL: 8700,
    last30DaysPnL: 34200,
    winRate: 55.8,
    activeMarkets: 9,
    tradesToday: 5,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Trend reversals",
    avoidWhen: "Sideways markets"
  },
  // Volatility Strategies
  {
    id: "acceleration-bands",
    name: "Acceleration Bands",
    description: "Envelope bands based on price movement to identify breakouts",
    todayPnL: 2540,
    last7DaysPnL: 11600,
    last30DaysPnL: 44800,
    winRate: 57.3,
    activeMarkets: 10,
    tradesToday: 6,
    status: "running",
    timeframe: "Daily",
    riskLevel: "high",
    bestConditions: "Volatility expansion",
    avoidWhen: "Low volatility"
  },
  {
    id: "bollinger-bands",
    name: "Bollinger Bands",
    description: "Volatility bands around moving average for overbought/oversold",
    todayPnL: 3780,
    last7DaysPnL: 16200,
    last30DaysPnL: 61500,
    winRate: 62.8,
    activeMarkets: 15,
    tradesToday: 10,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Range-bound with volatility",
    avoidWhen: "Strong trends"
  },
  {
    id: "projection-oscillator",
    name: "Projection Oscillator",
    description: "Projects price momentum using volatility and trend strength",
    todayPnL: 1670,
    last7DaysPnL: 7900,
    last30DaysPnL: 31200,
    winRate: 54.6,
    activeMarkets: 8,
    tradesToday: 5,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Volatile markets",
    avoidWhen: "Low volatility"
  },
  // Volume Strategies
  {
    id: "cmf",
    name: "Chaikin Money Flow (CMF)",
    description: "Volume-weighted average of accumulation and distribution",
    todayPnL: 2890,
    last7DaysPnL: 13400,
    last30DaysPnL: 49800,
    winRate: 59.7,
    activeMarkets: 11,
    tradesToday: 7,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "High volume trends",
    avoidWhen: "Low volume periods"
  },
  {
    id: "emv",
    name: "Ease of Movement (EMV)",
    description: "Relates price change to volume for effortless price movement",
    todayPnL: 1340,
    last7DaysPnL: 6200,
    last30DaysPnL: 26400,
    winRate: 53.2,
    activeMarkets: 7,
    tradesToday: 4,
    status: "paper",
    timeframe: "Daily",
    riskLevel: "low",
    bestConditions: "Easy price movement",
    avoidWhen: "Heavy volume churn"
  },
  {
    id: "force-index",
    name: "Force Index",
    description: "Combines price and volume to measure buying/selling pressure",
    todayPnL: 2120,
    last7DaysPnL: 9800,
    last30DaysPnL: 38100,
    winRate: 56.1,
    activeMarkets: 9,
    tradesToday: 6,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Volume confirmation",
    avoidWhen: "Thin volume"
  },
  {
    id: "mfi",
    name: "Money Flow Index",
    description: "Volume-weighted RSI showing money flowing in/out of security",
    todayPnL: 3120,
    last7DaysPnL: 14200,
    last30DaysPnL: 53700,
    winRate: 60.4,
    activeMarkets: 13,
    tradesToday: 8,
    status: "running",
    timeframe: "Daily",
    riskLevel: "medium",
    bestConditions: "Volume divergences",
    avoidWhen: "Low volume"
  },
  {
    id: "nvi",
    name: "Negative Volume Index (NVI)",
    description: "Tracks price changes on days when volume decreases",
    todayPnL: 890,
    last7DaysPnL: 4100,
    last30DaysPnL: 18200,
    winRate: 50.8,
    activeMarkets: 5,
    tradesToday: 3,
    status: "paper",
    timeframe: "Daily",
    riskLevel: "low",
    bestConditions: "Smart money accumulation",
    avoidWhen: "High volume days"
  },
  {
    id: "vwap",
    name: "Volume Weighted Average Price",
    description: "Average price weighted by volume, key for institutional trading",
    todayPnL: 4200,
    last7DaysPnL: 18900,
    last30DaysPnL: 68400,
    winRate: 64.5,
    activeMarkets: 16,
    tradesToday: 11,
    status: "running",
    timeframe: "Intraday",
    riskLevel: "medium",
    bestConditions: "Intraday trading",
    avoidWhen: "Low liquidity"
  }
], ms = [], ps = [
  {
    id: "fund-analyst",
    name: "Fundamentals Analyst",
    type: "analyst",
    queueLength: 3,
    avgLatency: 145,
    errorRate: 0.2,
    recentActivity: []
  },
  {
    id: "sentiment-analyst",
    name: "Sentiment Analyst",
    type: "analyst",
    queueLength: 5,
    avgLatency: 89,
    errorRate: 0.5,
    recentActivity: []
  },
  {
    id: "news-analyst",
    name: "News Analyst",
    type: "analyst",
    queueLength: 2,
    avgLatency: 112,
    errorRate: 0.1,
    recentActivity: []
  },
  {
    id: "tech-analyst",
    name: "Technical Analyst",
    type: "analyst",
    queueLength: 4,
    avgLatency: 67,
    errorRate: 0.3,
    recentActivity: []
  },
  {
    id: "bull-researcher",
    name: "Bull Researcher",
    type: "researcher",
    queueLength: 2,
    avgLatency: 234,
    errorRate: 0,
    recentActivity: []
  },
  {
    id: "bear-researcher",
    name: "Bear Researcher",
    type: "researcher",
    queueLength: 2,
    avgLatency: 241,
    errorRate: 0,
    recentActivity: []
  },
  {
    id: "trader",
    name: "Trader Agent",
    type: "trader",
    queueLength: 6,
    avgLatency: 45,
    errorRate: 0.8,
    recentActivity: []
  },
  {
    id: "risk-mgmt",
    name: "Risk Management",
    type: "risk",
    queueLength: 1,
    avgLatency: 78,
    errorRate: 0.1,
    recentActivity: [
      "Current VIX: 14.2 (Low volatility regime)",
      "Portfolio heat: 72% of max exposure",
      "Sector concentration check: Tech 42% (within limits)",
      "Approved NVDA position: Size validated against volatility",
      "Flagged correlation risk: 68% positions in tech sector"
    ]
  },
  {
    id: "portfolio-mgr",
    name: "Portfolio Manager",
    type: "pm",
    queueLength: 3,
    avgLatency: 156,
    errorRate: 0,
    recentActivity: [
      "Approved: NVDA buy (risk-adjusted, edge validated)",
      "Approved: META add (improves risk/reward profile)",
      "Rejected: Oversized TSLA short (correlation risk with existing shorts)",
      "Approved: Prediction market position (small size, uncorrelated)",
      "Rebalancing: Reduced tech exposure from 48% to 42%"
    ]
  }
], ys = [
  {
    id: "pm1",
    platform: "Polymarket",
    eventName: "Trump wins 2028 Presidential Election",
    currentOdds: 0.42,
    volume: 245e4,
    liquidity: 85e4,
    expectedEdge: 6,
    llmProbability: 0.48,
    category: "politics",
    timeToResolution: "1420 days",
    llmAnalysis: "Based on historical patterns, current sentiment analysis, and economic indicators, the LLM assigns a 48% probability vs market implied 42%. The model considers polling trends, economic forecasts, and historical re-election patterns. This represents a positive edge of +6%.",
    correlatedTickers: ["XLE", "XOP", "DIA"]
  },
  {
    id: "pm2",
    platform: "Kalshi",
    eventName: "Fed cuts rates by 50bp in March",
    currentOdds: 0.28,
    volume: 185e4,
    liquidity: 65e4,
    expectedEdge: 8.5,
    llmProbability: 0.365,
    category: "macro",
    timeToResolution: "89 days",
    llmAnalysis: "Recent Fed minutes and economic data suggest higher probability of aggressive rate cut than market pricing. CPI trending down, employment softening, and dovish Fed commentary all point to increased likelihood. Model probability 36.5% vs market 28%, edge of +8.5%.",
    correlatedTickers: ["TLT", "GLD", "XLF"]
  },
  {
    id: "pm3",
    platform: "Polymarket",
    eventName: "Bitcoin above $100k by EOY",
    currentOdds: 0.62,
    volume: 32e5,
    liquidity: 12e5,
    expectedEdge: 4.2,
    llmProbability: 0.58,
    category: "tech",
    timeToResolution: "28 days",
    llmAnalysis: "Market appears slightly overpriced. While institutional adoption continues and ETF flows are strong, technical resistance at $95k and historical year-end profit-taking suggest lower probability. Model shows 58% vs market 62%, negative edge of -4%, suggesting fade opportunity.",
    correlatedTickers: ["MSTR", "COIN", "SQ"]
  },
  {
    id: "pm4",
    platform: "Kalshi",
    eventName: "S&P 500 above 5000 by March",
    currentOdds: 0.72,
    volume: 165e4,
    liquidity: 58e4,
    expectedEdge: 5.8,
    llmProbability: 0.778,
    category: "macro",
    timeToResolution: "89 days",
    llmAnalysis: "Strong seasonal patterns, improving breadth, and rate cut expectations support higher probability. Current level 4850, only 3% gain needed. Historical Q1 returns and current momentum suggest 77.8% probability vs market 72%. Positive edge of +5.8%.",
    correlatedTickers: ["SPY", "QQQ", "IWM"]
  },
  {
    id: "pm5",
    platform: "Polymarket",
    eventName: "NVIDIA market cap exceeds Apple by June",
    currentOdds: 0.38,
    volume: 98e4,
    liquidity: 34e4,
    expectedEdge: 12.5,
    llmProbability: 0.505,
    category: "tech",
    timeToResolution: "180 days",
    llmAnalysis: "Market significantly underpricing this event. NVIDIA growth trajectory in AI, strong earnings momentum, and current gap of only $400B makes this very achievable. Historical precedent of rapid cap changes in tech. Model: 50.5% vs market 38%, exceptional edge of +12.5%.",
    correlatedTickers: ["NVDA", "AAPL", "SMH"]
  }
], gs = [
  {
    id: "trader1",
    name: "Nancy Pelosi",
    rank: 1,
    overallPnL: 245e4,
    winRate: 72.3,
    activePositions: 8,
    currentValue: 152e5,
    avgHoldingPeriod: "45 days",
    maxDrawdown: -8.5,
    volatility: 12.3,
    markets: ["Tech stocks", "Healthcare", "Financial"]
  },
  {
    id: "trader2",
    name: "Warren Buffett (Berkshire)",
    rank: 2,
    overallPnL: 89e5,
    winRate: 68.7,
    activePositions: 42,
    currentValue: 1285e5,
    avgHoldingPeriod: "1850 days",
    maxDrawdown: -15.2,
    volatility: 8.9,
    markets: ["Value stocks", "Financial", "Consumer"]
  },
  {
    id: "trader3",
    name: "@CryptoWhale247",
    rank: 3,
    overallPnL: 185e4,
    winRate: 58.2,
    activePositions: 24,
    currentValue: 42e5,
    avgHoldingPeriod: "8 days",
    maxDrawdown: -28.5,
    volatility: 42.6,
    markets: ["Crypto prediction markets", "Tech stocks"]
  },
  {
    id: "trader4",
    name: "Dan Loeb (Third Point)",
    rank: 4,
    overallPnL: 32e5,
    winRate: 65.8,
    activePositions: 18,
    currentValue: 285e5,
    avgHoldingPeriod: "120 days",
    maxDrawdown: -12.8,
    volatility: 15.4,
    markets: ["Activist positions", "Event-driven", "Tech"]
  },
  {
    id: "trader5",
    name: "@PolymarketPro",
    rank: 5,
    overallPnL: 68e4,
    winRate: 61.5,
    activePositions: 35,
    currentValue: 185e4,
    avgHoldingPeriod: "12 days",
    maxDrawdown: -18.5,
    volatility: 28.5,
    markets: ["Political markets", "Macro events", "Sports"]
  }
], hs = [
  {
    id: "pos1",
    asset: "NVDA",
    type: "stock",
    entryPrice: 782.5,
    currentPrice: 852.3,
    size: 200,
    unrealizedPnL: 13960,
    unrealizedPnLPercent: 8.92,
    strategy: "Momentum",
    openedBy: "Trader Agent",
    openedAt: "2024-11-15T10:30:00Z"
  },
  {
    id: "pos2",
    asset: "AAPL",
    type: "stock",
    entryPrice: 178.2,
    currentPrice: 182.45,
    size: 300,
    unrealizedPnL: 1275,
    unrealizedPnLPercent: 2.38,
    strategy: "Momentum",
    openedBy: "Trader Agent",
    openedAt: "2024-11-20T14:15:00Z"
  },
  {
    id: "pos3",
    asset: "META",
    type: "stock",
    entryPrice: 468.9,
    currentPrice: 485.2,
    size: 150,
    unrealizedPnL: 2445,
    unrealizedPnLPercent: 3.48,
    strategy: "Breakout",
    openedBy: "Trader Agent",
    openedAt: "2024-11-22T11:00:00Z"
  },
  {
    id: "pos4",
    asset: "TSLA",
    type: "stock",
    entryPrice: 245.8,
    currentPrice: 238.2,
    size: 100,
    unrealizedPnL: -760,
    unrealizedPnLPercent: -3.09,
    strategy: "Mean Reversion",
    openedBy: "Trader Agent",
    openedAt: "2024-11-18T09:45:00Z"
  },
  {
    id: "pos5",
    asset: "Trump wins 2028",
    type: "prediction_market",
    entryPrice: 0.4,
    currentPrice: 0.42,
    size: 15e3,
    unrealizedPnL: 300,
    unrealizedPnLPercent: 5,
    strategy: "PM-Edge",
    openedBy: "Trader Agent",
    openedAt: "2024-11-01T16:20:00Z"
  }
], fs = [
  {
    id: "trade1",
    asset: "NVDA",
    type: "stock",
    action: "buy",
    price: 852.3,
    size: 100,
    strategy: "Momentum",
    timestamp: "2024-12-03T09:35:00Z"
  },
  {
    id: "trade2",
    asset: "META",
    type: "stock",
    action: "buy",
    price: 485.2,
    size: 75,
    strategy: "Breakout",
    timestamp: "2024-12-03T10:15:00Z"
  },
  {
    id: "trade3",
    asset: "GOOGL",
    type: "stock",
    action: "sell",
    price: 142.8,
    size: 150,
    pnl: 2850,
    strategy: "Momentum",
    timestamp: "2024-12-02T15:45:00Z"
  },
  {
    id: "trade4",
    asset: "S&P 500 > 5000",
    type: "prediction_market",
    action: "buy",
    price: 0.72,
    size: 1e4,
    strategy: "PM-Edge",
    timestamp: "2024-12-02T11:20:00Z"
  },
  {
    id: "trade5",
    asset: "MSFT",
    type: "stock",
    action: "sell",
    price: 378.5,
    size: 120,
    pnl: -580,
    strategy: "Mean Reversion",
    timestamp: "2024-12-01T14:30:00Z"
  }
], ws = {
  vix: 14.2,
  vixRegime: "Low",
  portfolioVolatility: 18.5,
  maxSingleAsset: 6.5,
  maxSector: 42,
  currentLeverage: 1.35,
  maxLeverage: 2,
  varDaily: -12500,
  topConcentrations: [
    { name: "Technology", exposure: 42 },
    { name: "NVDA", exposure: 6.5 },
    { name: "Prediction Markets", exposure: 9.5 },
    { name: "META", exposure: 5.2 },
    { name: "AAPL", exposure: 4.8 }
  ]
};
function vs(...a) {
  return Ue(ze(a));
}
function ks(a, e = !1) {
  if (typeof window > "u") return;
  const t = new URL(document?.location.href);
  return a && (Object.entries(a).forEach(([s, n]) => {
    t.searchParams.set(s, n);
  }), e ? window.history.pushState({}, "", t) : window.history.replaceState({}, "", t)), Object.fromEntries(t.searchParams.entries()) || {};
}
class At {
  constructor(e, t) {
    this.provider = e.llmProvider, this.model = t, this.temperature = e.temperature ?? 0.3, e.baseUrl ? this.baseUrl = e.baseUrl : this.provider.toLowerCase() === "groq" && (this.baseUrl = "https://api.groq.com/openai/v1/chat/completions"), e.apiKeys ? this.apiKey = e.apiKeys[this.provider] || "" : this.apiKey = process.env[`${this.provider.toUpperCase()}_API_KEY`] || "";
  }
  /**
   * Invoke the LLM with a prompt
   */
  async invoke(e) {
    const t = typeof e == "string" ? [{ role: "user", content: e }] : e;
    switch (this.provider.toLowerCase()) {
      case "openai":
        return this.invokeOpenAI(t);
      case "groq":
        return this.invokeGroq(t);
      case "anthropic":
        return this.invokeAnthropic(t);
      default:
        throw new Error(`Unsupported LLM provider: ${this.provider}`);
    }
  }
  /**
   * Invoke OpenAI API
   */
  async invokeOpenAI(e) {
    const t = this.baseUrl || "https://api.openai.com/v1/chat/completions", s = await fetch(t, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: e,
        temperature: this.temperature
      })
    });
    if (!s.ok)
      throw new Error(`OpenAI API error: ${s.statusText}`);
    const n = await s.json();
    return {
      content: n.choices[0].message.content,
      toolCalls: n.choices[0].message.tool_calls?.map((r) => ({
        name: r.function.name,
        arguments: JSON.parse(r.function.arguments)
      }))
    };
  }
  /**
   * Invoke Groq API (OpenAI-compatible)
   */
  async invokeGroq(e) {
    const t = this.baseUrl || "https://api.groq.com/openai/v1/chat/completions", s = await fetch(t, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: e,
        temperature: this.temperature
      })
    });
    if (!s.ok) {
      const r = await s.text();
      throw new Error(`Groq API error: ${s.statusText} - ${r}`);
    }
    const n = await s.json();
    return {
      content: n.choices[0].message.content,
      toolCalls: n.choices[0].message.tool_calls?.map((r) => ({
        name: r.function.name,
        arguments: JSON.parse(r.function.arguments)
      }))
    };
  }
  /**
   * Invoke Anthropic API
   */
  async invokeAnthropic(e) {
    const t = this.baseUrl || "https://api.anthropic.com/v1/messages", s = e.find((l) => l.role === "system"), n = e.filter((l) => l.role !== "system"), r = await fetch(t, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        temperature: this.temperature,
        system: s?.content,
        messages: n.map((l) => ({
          role: l.role === "assistant" ? "assistant" : "user",
          content: l.content
        }))
      })
    });
    if (!r.ok)
      throw new Error(`Anthropic API error: ${r.statusText}`);
    return {
      content: (await r.json()).content[0].text
    };
  }
  /**
   * Invoke with tool binding
   */
  async invokeWithTools(e, t) {
    switch (this.provider.toLowerCase()) {
      case "openai":
      case "groq":
        return this.invokeWithToolsOpenAI(e, t);
      case "anthropic":
        return this.invoke(e);
      default:
        return this.invoke(e);
    }
  }
  /**
   * Invoke OpenAI/Groq with tools
   */
  async invokeWithToolsOpenAI(e, t) {
    const s = this.provider.toLowerCase() === "groq" ? this.baseUrl || "https://api.groq.com/openai/v1/chat/completions" : this.baseUrl || "https://api.openai.com/v1/chat/completions", n = await fetch(s, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: e,
        temperature: this.temperature,
        tools: t,
        tool_choice: "auto"
      })
    });
    if (!n.ok) {
      const i = await n.text();
      throw new Error(`${this.provider} API error: ${n.statusText} - ${i}`);
    }
    const r = await n.json();
    return {
      content: r.choices[0].message.content,
      toolCalls: r.choices[0].message.tool_calls?.map((i) => ({
        name: i.function.name,
        arguments: JSON.parse(i.function.arguments)
      }))
    };
  }
}
function ie(a, e) {
  return new At(a, e);
}
class B {
  constructor(e, t) {
    this.memories = [], this.name = e, this.config = t;
  }
  /**
   * Add a new memory to the store
   */
  async addMemory(e) {
    this.memories.push({
      ...e,
      timestamp: /* @__PURE__ */ new Date()
    }), this.memories.length > 100 && (this.memories = this.memories.slice(-100));
  }
  /**
   * Get memories similar to the current situation
   * Uses simple keyword matching for now, can be enhanced with embeddings
   */
  async getMemories(e, t = 2) {
    if (this.memories.length === 0)
      return [];
    const s = this.memories.map((n) => {
      const r = this.calculateSimilarity(e, n.situation);
      return { memory: n, score: r };
    });
    return s.sort((n, r) => r.score - n.score), s.slice(0, t).map((n) => n.memory);
  }
  /**
   * Calculate similarity between two text strings using keyword overlap
   * Can be enhanced with more sophisticated methods like cosine similarity with embeddings
   */
  calculateSimilarity(e, t) {
    const s = this.tokenize(e), n = this.tokenize(t), r = s.filter((l) => n.includes(l)), i = /* @__PURE__ */ new Set([...s, ...n]);
    return r.length / i.size;
  }
  /**
   * Tokenize text into meaningful words
   */
  tokenize(e) {
    return e.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter((t) => t.length > 3);
  }
  /**
   * Clear all memories
   */
  clear() {
    this.memories = [];
  }
  /**
   * Get all memories
   */
  getAllMemories() {
    return [...this.memories];
  }
  /**
   * Get memory count
   */
  getMemoryCount() {
    return this.memories.length;
  }
}
async function St(a, e, t) {
  try {
    const s = await Fe.getHistoricalData({
      symbol: a,
      period1: e,
      period2: t,
      interval: "1d"
    });
    if (!s.success || !s.data)
      throw new Error(`Failed to fetch stock data for ${a}`);
    return s.data.map((n) => ({
      date: n.date,
      open: n.open,
      high: n.high,
      low: n.low,
      close: n.close,
      volume: n.volume
    }));
  } catch (s) {
    throw console.error("Error fetching stock data:", s), s;
  }
}
async function Pt(a, e) {
  const t = {}, s = a.map((l) => l.close), n = a.map((l) => l.high), r = a.map((l) => l.low), i = a.map((l) => l.volume);
  for (const l of e)
    switch (l.toLowerCase()) {
      case "close_50_sma":
      case "sma50":
        t.sma50 = ne(s, 50);
        break;
      case "close_200_sma":
      case "sma200":
        t.sma200 = ne(s, 200);
        break;
      case "close_10_ema":
      case "ema10":
        t.ema10 = K(s, 10);
        break;
      case "rsi":
        t.rsi = Tt(s, 14);
        break;
      case "macd":
        const d = Nt(s);
        t.macd = d.macd, t.macdSignal = d.signal, t.macdHistogram = d.histogram;
        break;
      case "boll":
      case "bollinger":
        const u = Dt(s, 20, 2);
        t.bollingerUpper = u.upper, t.bollingerMiddle = u.middle, t.bollingerLower = u.lower;
        break;
      case "atr":
        t.atr = Lt(n, r, s, 14);
        break;
      case "vwma":
        t.vwma = Ct(s, i, 20);
        break;
    }
  return t;
}
async function _s(a) {
  try {
    const e = await fetch(`/api/stocks/quote/${a}`);
    if (!e.ok)
      throw new Error("Failed to fetch fundamentals");
    const t = await e.json();
    return {
      marketCap: t.marketCap,
      peRatio: t.peRatio,
      dividendYield: t.dividendYield,
      eps: t.eps,
      revenue: t.revenue,
      profitMargin: t.profitMargin
    };
  } catch (e) {
    throw console.error("Error fetching fundamentals:", e), e;
  }
}
async function bs(a, e = 10) {
  try {
    return [];
  } catch (t) {
    return console.error("Error fetching news:", t), [];
  }
}
function ne(a, e) {
  const t = [];
  for (let s = 0; s < a.length; s++)
    if (s < e - 1)
      t.push(NaN);
    else {
      const n = a.slice(s - e + 1, s + 1).reduce((r, i) => r + i, 0);
      t.push(n / e);
    }
  return t;
}
function K(a, e) {
  const t = [], s = 2 / (e + 1);
  let n = a.slice(0, e).reduce((r, i) => r + i, 0) / e;
  t.push(...Array(e - 1).fill(NaN)), t.push(n);
  for (let r = e; r < a.length; r++)
    n = (a[r] - n) * s + n, t.push(n);
  return t;
}
function Tt(a, e = 14) {
  const t = [], s = [], n = [];
  for (let r = 1; r < a.length; r++) {
    const i = a[r] - a[r - 1];
    s.push(i > 0 ? i : 0), n.push(i < 0 ? Math.abs(i) : 0);
  }
  for (let r = 0; r < s.length; r++)
    if (r < e - 1)
      t.push(NaN);
    else {
      const i = s.slice(r - e + 1, r + 1).reduce((g, y) => g + y, 0) / e, l = n.slice(r - e + 1, r + 1).reduce((g, y) => g + y, 0) / e, u = 100 - 100 / (1 + (l === 0 ? 100 : i / l));
      t.push(u);
    }
  return t.unshift(NaN), t;
}
function Nt(a) {
  const e = K(a, 12), t = K(a, 26), s = e.map((l, d) => l - t[d]), n = K(s.filter((l) => !isNaN(l)), 9), r = [...Array(s.length - n.length).fill(NaN), ...n], i = s.map((l, d) => l - r[d]);
  return { macd: s, signal: r, histogram: i };
}
function Dt(a, e = 20, t = 2) {
  const s = ne(a, e), n = [], r = [];
  for (let i = 0; i < a.length; i++)
    if (i < e - 1)
      n.push(NaN), r.push(NaN);
    else {
      const l = a.slice(i - e + 1, i + 1), d = s[i], u = l.reduce((y, h) => y + Math.pow(h - d, 2), 0) / e, g = Math.sqrt(u);
      n.push(d + t * g), r.push(d - t * g);
    }
  return { upper: n, middle: s, lower: r };
}
function Lt(a, e, t, s = 14) {
  const n = [], r = [];
  for (let i = 1; i < a.length; i++) {
    const l = a[i] - e[i], d = Math.abs(a[i] - t[i - 1]), u = Math.abs(e[i] - t[i - 1]);
    r.push(Math.max(l, d, u));
  }
  n.push(NaN);
  for (let i = 0; i < r.length; i++)
    if (i < s - 1)
      n.push(NaN);
    else {
      const l = r.slice(i - s + 1, i + 1).reduce((d, u) => d + u, 0) / s;
      n.push(l);
    }
  return n;
}
function Ct(a, e, t = 20) {
  const s = [];
  for (let n = 0; n < a.length; n++)
    if (n < t - 1)
      s.push(NaN);
    else {
      const r = a.slice(n - t + 1, n + 1), i = e.slice(n - t + 1, n + 1), l = r.reduce((u, g, y) => u + g * i[y], 0), d = i.reduce((u, g) => u + g, 0);
      s.push(l / d);
    }
  return s;
}
class Mt {
  constructor(e) {
    this.llm = e;
  }
  async analyze(e) {
    const { companyOfInterest: t, tradeDate: s } = e, n = `You are a trading assistant tasked with analyzing financial markets. Your role is to select the **most relevant indicators** for a given market condition or trading strategy from the following list. The goal is to choose up to **8 indicators** that provide complementary insights without redundancy.

Moving Averages:
- close_50_sma: 50 SMA: A medium-term trend indicator. Identify trend direction and support/resistance.
- close_200_sma: 200 SMA: A long-term trend benchmark. Confirm overall market trend and golden/death cross.
- close_10_ema: 10 EMA: A responsive short-term average. Capture quick momentum shifts.

MACD Related:
- macd: MACD: Momentum via EMA differences. Look for crossovers and divergence.
- macds: MACD Signal: EMA smoothing of MACD line. Use crossovers to trigger trades.
- macdh: MACD Histogram: Gap between MACD and signal. Visualize momentum strength.

Momentum Indicators:
- rsi: RSI: Measures overbought/oversold conditions using 70/30 thresholds.

Volatility Indicators:
- boll: Bollinger Middle: 20 SMA basis for Bollinger Bands.
- boll_ub: Bollinger Upper: 2 std devs above middle, signals overbought.
- boll_lb: Bollinger Lower: 2 std devs below middle, signals oversold.
- atr: ATR: Measures volatility for stop-loss and position sizing.

Volume-Based Indicators:
- vwma: VWMA: Volume-weighted moving average confirms trends.

Select indicators that provide diverse information and explain why they're suitable. Write a detailed report of trends observed.
Make sure to append a Markdown table at the end of the report to organize key points.

For your reference, the current date is ${s}. The company we want to analyze is ${t}.`;
    try {
      const r = new Date(s), i = new Date(r);
      i.setMonth(i.getMonth() - 6);
      const l = await St(t, i, r), u = await Pt(l, [
        "close_50_sma",
        "close_200_sma",
        "close_10_ema",
        "rsi",
        "macd",
        "boll",
        "atr",
        "vwma"
      ]), g = l.slice(-20), y = `
Recent Price Action for ${t}:
${g.map((P) => `${P.date}: Close=$${P.close.toFixed(2)}, Volume=${P.volume}`).join(`
`)}

Technical Indicators (Latest Values):
- 50 SMA: ${u.sma50?.slice(-1)[0]?.toFixed(2) || "N/A"}
- 200 SMA: ${u.sma200?.slice(-1)[0]?.toFixed(2) || "N/A"}
- 10 EMA: ${u.ema10?.slice(-1)[0]?.toFixed(2) || "N/A"}
- RSI: ${u.rsi?.slice(-1)[0]?.toFixed(2) || "N/A"}
- MACD: ${u.macd?.slice(-1)[0]?.toFixed(2) || "N/A"}
- Bollinger Upper: ${u.bollingerUpper?.slice(-1)[0]?.toFixed(2) || "N/A"}
- Bollinger Middle: ${u.bollingerMiddle?.slice(-1)[0]?.toFixed(2) || "N/A"}
- Bollinger Lower: ${u.bollingerLower?.slice(-1)[0]?.toFixed(2) || "N/A"}
- ATR: ${u.atr?.slice(-1)[0]?.toFixed(2) || "N/A"}
- VWMA: ${u.vwma?.slice(-1)[0]?.toFixed(2) || "N/A"}

Please analyze these indicators and provide a comprehensive market analysis report.`, h = [
        { role: "system", content: n },
        { role: "user", content: y }
      ], S = await this.llm.invoke(h);
      return {
        marketReport: S.content,
        messages: [...e.messages, { role: "assistant", content: S.content }],
        sender: "MarketAnalyst"
      };
    } catch (r) {
      return console.error("Market Analyst error:", r), {
        marketReport: `Error analyzing market data for ${t}: ${r}`,
        sender: "MarketAnalyst"
      };
    }
  }
}
class It {
  constructor(e, t) {
    this.llm = e, this.memory = t;
  }
  async analyze(e) {
    const { investmentDebateState: t, marketReport: s, sentimentReport: n, newsReport: r, fundamentalsReport: i } = e, l = `${s}

${n}

${r}

${i}`, d = await this.memory.getMemories(l, 2);
    let u = "";
    d.length > 0 ? u = d.map((P) => P.recommendation).join(`

`) : u = "No past memories found.";
    const g = `You are a Bull Analyst advocating for investing in the stock. Your task is to build a strong, evidence-based case emphasizing growth potential, competitive advantages, and positive market indicators. Leverage the provided research and data to address concerns and counter bearish arguments effectively.

Key points to focus on:
- Growth Potential: Highlight the company's market opportunities, revenue projections, and scalability.
- Competitive Advantages: Emphasize factors like unique products, strong branding, or dominant market positioning.
- Positive Indicators: Use financial health, industry trends, and recent positive news as evidence.
- Bear Counterpoints: Critically analyze the bear argument with specific data and sound reasoning, addressing concerns thoroughly and showing why the bull perspective holds stronger merit.
- Engagement: Present your argument in a conversational style, engaging directly with the bear analyst's points and debating effectively rather than just listing data.

Resources available:
Market research report: ${s}
Social media sentiment report: ${n}
Latest world affairs news: ${r}
Company fundamentals report: ${i}
Conversation history of the debate: ${t.history}
Last bear argument: ${t.currentResponse}
Reflections from similar situations and lessons learned: ${u}

Use this information to deliver a compelling bull argument, refute the bear's concerns, and engage in a dynamic debate that demonstrates the strengths of the bull position. You must also address reflections and learn from lessons and mistakes you made in the past.`, h = `Bull Analyst: ${(await this.llm.invoke(g)).content}`;
    return {
      investmentDebateState: {
        history: t.history + `
` + h,
        bullHistory: t.bullHistory + `
` + h,
        bearHistory: t.bearHistory,
        currentResponse: h,
        judgeDecision: t.judgeDecision,
        count: t.count + 1
      }
    };
  }
}
class Rt {
  constructor(e, t) {
    this.llm = e, this.memory = t;
  }
  async analyze(e) {
    const { investmentDebateState: t, marketReport: s, sentimentReport: n, newsReport: r, fundamentalsReport: i } = e, l = `${s}

${n}

${r}

${i}`, d = await this.memory.getMemories(l, 2);
    let u = "";
    d.length > 0 ? u = d.map((P) => P.recommendation).join(`

`) : u = "No past memories found.";
    const g = `You are a Bear Analyst advocating for caution or avoiding investment in the stock. Your task is to build a strong, evidence-based case emphasizing risks, challenges, and negative market indicators. Use the provided research and data to highlight concerns and counter bullish arguments effectively.

Key points to focus on:
- Risk Factors: Identify market risks, competitive threats, regulatory challenges, or economic headwinds.
- Valuation Concerns: Point out if the stock is overvalued based on fundamentals or technical indicators.
- Negative Indicators: Use weak financial metrics, declining trends, or negative news as evidence.
- Bull Counterpoints: Critically analyze the bull argument with specific data and reasoning, showing why the bear perspective is more prudent.
- Engagement: Present your argument conversationally, directly engaging with the bull analyst's points.

Resources available:
Market research report: ${s}
Social media sentiment report: ${n}
Latest world affairs news: ${r}
Company fundamentals report: ${i}
Conversation history of the debate: ${t.history}
Last bull argument: ${t.currentResponse}
Reflections from similar situations and lessons learned: ${u}

Use this information to deliver a compelling bear argument, highlight risks, and engage in a dynamic debate. Learn from past mistakes reflected in the memories provided.`, h = `Bear Analyst: ${(await this.llm.invoke(g)).content}`;
    return {
      investmentDebateState: {
        history: t.history + `
` + h,
        bullHistory: t.bullHistory,
        bearHistory: t.bearHistory + `
` + h,
        currentResponse: h,
        judgeDecision: t.judgeDecision,
        count: t.count + 1
      }
    };
  }
}
class $t {
  constructor(e, t) {
    this.llm = e, this.memory = t;
  }
  async makeDecision(e) {
    const { investmentDebateState: t, companyOfInterest: s } = e, n = `You are an Investment Judge tasked with evaluating the debate between a Bull Analyst and a Bear Analyst regarding ${s}.

Review the complete debate history:
${t.history}

Based on the arguments presented by both sides:
1. Evaluate the strength of each argument
2. Consider the evidence provided
3. Assess the risks and opportunities
4. Make a final decision: Should we INVEST or NOT INVEST?

Provide your reasoning and conclude with a clear decision: "FINAL DECISION: INVEST" or "FINAL DECISION: NOT INVEST"`, r = await this.llm.invoke(n), i = r.content.includes("INVEST") && !r.content.includes("NOT INVEST") ? "INVEST" : "NOT INVEST";
    return {
      investmentDebateState: {
        ...t,
        judgeDecision: r.content
      },
      investmentPlan: i === "INVEST" ? "Proceed with investment based on bull arguments" : "Avoid investment due to bear concerns"
    };
  }
}
class Ot {
  constructor(e, t) {
    this.llm = e, this.memory = t;
  }
  async makeDecision(e) {
    const {
      companyOfInterest: t,
      investmentPlan: s,
      marketReport: n,
      sentimentReport: r,
      newsReport: i,
      fundamentalsReport: l
    } = e, d = `${n}

${r}

${i}

${l}`, u = await this.memory.getMemories(d, 2);
    let g = "";
    u.length > 0 ? g = u.map((S) => S.recommendation).join(`

`) : g = "No past memories found.";
    const y = [
      {
        role: "system",
        content: `You are a trading agent analyzing market data to make investment decisions. Based on your analysis, provide a specific recommendation to buy, sell, or hold. End with a firm decision and always conclude your response with 'FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL**' to confirm your recommendation.

Do not forget to utilize lessons from past decisions to learn from your mistakes. Here is some reflections from similar situations you traded in and the lessons learned:

${g}`
      },
      {
        role: "user",
        content: `Based on a comprehensive analysis by a team of analysts, here is an investment plan tailored for ${t}. This plan incorporates insights from current technical market trends, macroeconomic indicators, and social media sentiment. Use this plan as a foundation for evaluating your next trading decision.

Proposed Investment Plan: ${s}

Leverage these insights to make an informed and strategic decision.`
      }
    ], h = await this.llm.invoke(y);
    return {
      traderInvestmentPlan: h.content,
      messages: [...e.messages, { role: "assistant", content: h.content }],
      sender: "Trader"
    };
  }
}
const Et = {
  llmProvider: "groq",
  deepThinkLLM: "llama3-70b-8192",
  quickThinkLLM: "llama3-8b-8192",
  temperature: 0.3,
  projectDir: "./data",
  apiKeys: {
    groq: process.env.GROQ_API_KEY || ""
  }
};
class As {
  constructor(e = ["market", "social", "news", "fundamentals"], t = !1, s) {
    this.currentState = null, this.ticker = null, this.logStatesDict = {}, this.selectedAnalysts = e, this.debug = t, this.config = { ...Et, ...s }, this.deepThinkingLLM = ie(this.config, this.config.deepThinkLLM), this.quickThinkingLLM = ie(this.config, this.config.quickThinkLLM), this.bullMemory = new B("bull_memory", this.config), this.bearMemory = new B("bear_memory", this.config), this.traderMemory = new B("trader_memory", this.config), this.investJudgeMemory = new B("invest_judge_memory", this.config), this.riskManagerMemory = new B("risk_manager_memory", this.config), this.marketAnalyst = new Mt(this.deepThinkingLLM), this.bullResearcher = new It(this.deepThinkingLLM, this.bullMemory), this.bearResearcher = new Rt(this.deepThinkingLLM, this.bearMemory), this.investmentJudge = new $t(this.quickThinkingLLM, this.investJudgeMemory), this.trader = new Ot(this.quickThinkingLLM, this.traderMemory);
  }
  /**
   * Run the trading agents graph for a company on a specific date
   */
  async propagate(e, t) {
    this.ticker = e;
    const s = this.createInitialState(e, t);
    this.debug && console.log(`
=== Starting Analysis for ${e} on ${t} ===
`);
    let n = s;
    if (this.selectedAnalysts.includes("market")) {
      this.debug && console.log("Running Market Analyst...");
      const u = await this.marketAnalyst.analyze(n);
      n = { ...n, ...u };
    }
    n.sentimentReport || (n.sentimentReport = "No social media analysis performed."), n.newsReport || (n.newsReport = "No news analysis performed."), n.fundamentalsReport || (n.fundamentalsReport = "No fundamentals analysis performed."), this.debug && console.log(`
=== Investment Debate ===`), n.investmentDebateState = {
      bullHistory: "",
      bearHistory: "",
      history: "",
      currentResponse: "",
      judgeDecision: "",
      count: 0
    };
    for (let u = 0; u < 3; u++) {
      this.debug && console.log(`
Debate Round ${u + 1}`);
      const g = await this.bullResearcher.analyze(n);
      n = { ...n, ...g };
      const y = await this.bearResearcher.analyze(n);
      n = { ...n, ...y };
    }
    this.debug && console.log(`
Investment Judge making decision...`);
    const r = await this.investmentJudge.makeDecision(n);
    n = { ...n, ...r }, this.debug && console.log(`
Trader making final decision...`);
    const i = await this.trader.makeDecision(n);
    n = { ...n, ...i };
    const l = this.extractDecision(n.traderInvestmentPlan || "");
    n.finalTradeDecision = l, this.currentState = n, this.logState(t, n);
    const d = this.processSignal(l);
    return this.debug && console.log(`
=== Final Decision: ${d.action} (Confidence: ${d.confidence}) ===
`), { state: n, signal: d };
  }
  /**
   * Create initial state for the graph
   */
  createInitialState(e, t) {
    return {
      companyOfInterest: e,
      tradeDate: t,
      messages: [],
      sender: "",
      marketReport: "",
      sentimentReport: "",
      newsReport: "",
      fundamentalsReport: "",
      investmentDebateState: {
        bullHistory: "",
        bearHistory: "",
        history: "",
        currentResponse: "",
        judgeDecision: "",
        count: 0
      },
      investmentPlan: "",
      traderInvestmentPlan: "",
      riskDebateState: {
        riskyHistory: "",
        safeHistory: "",
        neutralHistory: "",
        history: "",
        latestSpeaker: "",
        currentRiskyResponse: "",
        currentSafeResponse: "",
        currentNeutralResponse: "",
        judgeDecision: "",
        count: 0
      },
      finalTradeDecision: ""
    };
  }
  /**
   * Extract trading decision from text
   */
  extractDecision(e) {
    const t = e.toUpperCase();
    return t.includes("BUY") && !t.includes("NOT BUY") ? "BUY" : t.includes("SELL") && !t.includes("NOT SELL") ? "SELL" : "HOLD";
  }
  /**
   * Process a trading signal
   */
  processSignal(e) {
    return {
      action: e,
      confidence: 0.75,
      // Can be enhanced with more sophisticated confidence scoring
      reasoning: "Based on multi-agent analysis and debate",
      timestamp: /* @__PURE__ */ new Date()
    };
  }
  /**
   * Log the final state
   */
  logState(e, t) {
    this.logStatesDict[e] = {
      companyOfInterest: t.companyOfInterest,
      tradeDate: t.tradeDate,
      marketReport: t.marketReport,
      sentimentReport: t.sentimentReport,
      newsReport: t.newsReport,
      fundamentalsReport: t.fundamentalsReport,
      investmentDebateState: {
        bullHistory: t.investmentDebateState.bullHistory,
        bearHistory: t.investmentDebateState.bearHistory,
        history: t.investmentDebateState.history,
        currentResponse: t.investmentDebateState.currentResponse,
        judgeDecision: t.investmentDebateState.judgeDecision
      },
      traderInvestmentDecision: t.traderInvestmentPlan,
      finalTradeDecision: t.finalTradeDecision
    };
  }
  /**
   * Reflect on decisions and update memory
   */
  async reflectAndRemember(e) {
    if (!this.currentState) return;
    const t = `${this.currentState.marketReport}
${this.currentState.newsReport}`, s = this.currentState.finalTradeDecision, n = `Decision: ${s}, Outcome: ${e > 0 ? "Positive" : "Negative"} (${e.toFixed(2)}%)`, r = {
      situation: t,
      decision: s,
      outcome: e,
      recommendation: n,
      timestamp: /* @__PURE__ */ new Date()
    };
    await this.bullMemory.addMemory(r), await this.bearMemory.addMemory(r), await this.traderMemory.addMemory(r), await this.investJudgeMemory.addMemory(r);
  }
  /**
   * Get all logged states
   */
  getLogStates() {
    return this.logStatesDict;
  }
  /**
   * Get the current state
   */
  getCurrentState() {
    return this.currentState;
  }
}
const G = Be.join(process.cwd(), "lib/algo-stategies/algo-strategies.json");
function xt() {
  if (!se.existsSync(G)) return {};
  try {
    const a = JSON.parse(se.readFileSync(G, "utf8")), e = {};
    return Array.isArray(a) && a.forEach((t) => {
      t.url && (e[t.url] = t);
    }), e;
  } catch {
    return {};
  }
}
async function zt(a = 1, e = "") {
  const t = e ? `&sort=${e}` : "", s = a === 1 ? `https://www.tradingview.com/scripts/?component-data-only=1&script_type=strategies${t}` : `https://www.tradingview.com/scripts/page-${a}/?component-data-only=1&script_type=strategies${t}`;
  return ((await F.get(s, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "application/json"
    }
  })).data?.data?.ideas?.data?.items || []).map((d) => {
    const u = d.user?.username || null, g = d.chart_url || `https://www.tradingview.com/script/${d.image_url}/`, y = d.likes_count || 0;
    d.comments_count;
    const h = d.image_url || null;
    return d.symbol && (d.symbol.short_name, d.symbol.exchange, d.symbol.logo_urls && d.symbol.logo_urls[0]), {
      url: g.split("script/")[1].replace(/\/$/, ""),
      name: d.name || null,
      description: d.description || null,
      image_url: h,
      author: u,
      likes: y,
      type: d.script_type || null
      // ...symbol
    };
  });
}
async function Ut(a, e) {
  if (e[a.url] && e[a.url].source)
    return console.log(`Using cached data for ${a.url}`), e[a.url];
  try {
    const t = `https://www.tradingview.com/script/${a.url}`, r = (await F.get(t, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    })).data.match(
      /"script_id_part"\s*:\s*"([^"]+)"(?:[^}]+?"version_maj"\s*:\s*(\d+))?/
    );
    if (!r)
      return console.log(`No script_id_part found for ${a.url}`), a;
    const i = r[1], l = r[2] ? Number(r[2]) : 3, u = `https://pine-facade.tradingview.com/pine-facade/get/${encodeURIComponent(i)}/${l}?no_4xx=true`;
    console.log(
      `Fetching pine-facade for ${a.url} -> ${i} (version_maj=${l})`
    );
    const y = (await F.get(u, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    })).data;
    let { created: h, updated: S, source: P } = y;
    h = new Date(h).toISOString().split("T")[0], S = new Date(S).toISOString().split("T")[0];
    const p = {
      ...a,
      // created,
      updated: S,
      source: P
    };
    return e[a.url] = p, console.log(`Enriched ${a.url}`), p;
  } catch (t) {
    return console.log(`Error enriching ${a.url}: ${t.message}`), a;
  }
}
async function Ft() {
  const a = xt(), e = process.argv.slice(2), t = e.find((y) => y.startsWith("--sort=")), s = t ? t.split("=")[1] : "", n = s === "recent" ? "recent_extended" : s, r = e.find((y) => y.startsWith("--pages=")), i = r ? parseInt(r.split("=")[1], 10) : 1, l = Array.from({ length: i }, (y, h) => h + 1), d = [];
  console.log(`Fetching TradingView scripts${n ? ` (sorted by: ${n})` : ""}...`);
  for (const y of l) {
    console.log(`Fetching page ${y}...`);
    const h = await zt(y, n);
    d.push(...h);
  }
  console.log(`
Enriching ${d.length} scripts with Pine Script source code...
`);
  const u = [];
  for (const y of d) {
    const h = await Ut(y, a);
    u.push(h), a[h.url] = h;
  }
  se.writeFileSync(
    G,
    JSON.stringify(u, null, 2),
    "utf8"
  ), console.log(`
Done! Total items: ${u.length}`), console.log(`Output saved to: ${G}`);
  const g = u.filter((y) => y.source).length;
  console.log(`Scripts with source code: ${g}/${u.length}`);
}
Ft().catch((a) => {
  console.error(a), process.exit(1);
});
function Ss(a) {
  return new je({
    keyId: a.keyId,
    secretKey: a.secretKey,
    paper: a.paper ?? !0
  });
}
const Bt = process.env.NEXT_PUBLIC_ALPACA_MCP_URL || "http://localhost:3001";
class jt {
  constructor(e) {
    this.baseURL = e?.baseURL || Bt, this.apiKey = e?.apiKey, this.apiSecret = e?.apiSecret;
  }
  // Helper method for MCP tool calls
  async callTool(e, t = {}) {
    const s = await fetch(`${this.baseURL}/mcp/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.apiKey && { "X-API-Key": this.apiKey },
        ...this.apiSecret && { "X-API-Secret": this.apiSecret }
      },
      body: JSON.stringify({
        tool: e,
        arguments: t
      })
    });
    if (!s.ok) {
      const r = await s.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(r.error || `MCP call failed: ${s.statusText}`);
    }
    const n = await s.json();
    if (!n.success)
      throw new Error(n.error || "Tool call failed");
    return n.data;
  }
  // =========================================================================
  // Account & Portfolio Methods
  // =========================================================================
  async getAccount() {
    return this.callTool("get_account", {});
  }
  async getPositions() {
    return this.callTool("get_all_positions", {});
  }
  async getPosition(e) {
    return this.callTool("get_position", { symbol: e });
  }
  async getPortfolioHistory(e) {
    return this.callTool("get_portfolio_history", e || {});
  }
  // =========================================================================
  // Order Management Methods
  // =========================================================================
  async placeOrder(e) {
    return this.callTool("place_order", e);
  }
  async getOrders(e) {
    return this.callTool("get_orders", e || {});
  }
  async getOrder(e) {
    return this.callTool("get_order", { order_id: e });
  }
  async cancelOrder(e) {
    return this.callTool("cancel_order", { order_id: e });
  }
  async closePosition(e, t) {
    return this.callTool("close_position", {
      symbol: e,
      ...t && { qty: t }
    });
  }
  async closeAllPositions() {
    return this.callTool("close_all_positions", {});
  }
  // =========================================================================
  // Market Data Methods
  // =========================================================================
  async getQuote(e) {
    return this.callTool("get_latest_quote", { symbol: e });
  }
  async getBars(e) {
    return this.callTool("get_bars", e);
  }
  async getLatestBar(e) {
    return this.callTool("get_latest_bar", { symbol: e });
  }
  async getSnapshot(e) {
    return this.callTool("get_snapshot", { symbol: e });
  }
  async searchAssets(e) {
    return this.callTool("search_assets", e || {});
  }
  // =========================================================================
  // Options Trading Methods
  // =========================================================================
  async getOptionChain(e) {
    return this.callTool("get_option_chain", e);
  }
  async placeOptionOrder(e) {
    return this.callTool("place_option_order", e);
  }
  // =========================================================================
  // Crypto Trading Methods
  // =========================================================================
  async getCryptoBars(e) {
    return this.callTool("get_crypto_bars", e);
  }
  async getCryptoQuote(e) {
    return this.callTool("get_latest_crypto_quote", { symbol: e });
  }
  async placeCryptoOrder(e) {
    return this.callTool("place_crypto_order", e);
  }
  // =========================================================================
  // Watchlist Methods
  // =========================================================================
  async getWatchlists() {
    return this.callTool("get_watchlists", {});
  }
  async createWatchlist(e, t) {
    return this.callTool("create_watchlist", { name: e, symbols: t });
  }
  async addToWatchlist(e, t) {
    return this.callTool("add_to_watchlist", {
      watchlist_id: e,
      symbol: t
    });
  }
  async deleteWatchlist(e) {
    return this.callTool("delete_watchlist", { watchlist_id: e });
  }
  // =========================================================================
  // Calendar & Corporate Actions
  // =========================================================================
  async getMarketCalendar(e) {
    return this.callTool("get_market_calendar", e || {});
  }
  async getCorporateActions(e) {
    return this.callTool("get_corporate_actions", e);
  }
  // =========================================================================
  // Strategy Chat Methods
  // =========================================================================
  async chatWithAI(e) {
    try {
      const t = await fetch("/api/alpaca/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: e })
      });
      if (!t.ok)
        throw new Error(`Chat API error: ${t.statusText}`);
      const s = await t.json();
      return {
        role: "assistant",
        content: s.content,
        timestamp: new Date(s.timestamp),
        suggestions: s.suggestions || []
      };
    } catch (t) {
      return console.error("Chat error:", t), {
        role: "assistant",
        content: `Sorry, I encountered an error: ${t.message}

Please try again or check your GROQ API key configuration.`,
        timestamp: /* @__PURE__ */ new Date(),
        suggestions: [
          "What is a momentum trading strategy?",
          "How do I set stop loss and take profit?",
          "Explain technical indicators for trading"
        ]
      };
    }
  }
  async generateStrategyFromDescription(e) {
    return {
      name: "AI Generated Strategy",
      description: e,
      symbols: ["AAPL", "MSFT", "GOOGL"],
      active: !1,
      rules: [
        {
          id: "1",
          type: "entry",
          condition: {
            indicator: "price",
            operator: "crosses_above",
            value: "sma_20",
            timeframe: "1D"
          },
          action: {
            type: "buy",
            orderType: "market"
          }
        },
        {
          id: "2",
          type: "exit",
          condition: {
            indicator: "price",
            operator: "crosses_below",
            value: "sma_20",
            timeframe: "1D"
          },
          action: {
            type: "sell",
            orderType: "market"
          }
        }
      ],
      riskManagement: {
        maxPositionSize: 10,
        stopLoss: 5,
        takeProfit: 15,
        maxDailyLoss: 2,
        trailingStop: 3
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
const ee = new jt();
async function Ps() {
  return ee.getAccount();
}
async function Ts(a) {
  return ee.placeOrder(a);
}
async function Ns(a) {
  return ee.getQuote(a);
}
async function Ds(a) {
  return ee.chatWithAI(a);
}
const qt = "/api", Wt = {
  sp500Top: ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "BRK.B", "LLY", "V"],
  tech: ["AAPL", "MSFT", "NVDA", "GOOGL", "META", "TSLA", "ORCL", "CRM", "ADBE", "NFLX"],
  faang: ["META", "AAPL", "AMZN", "NFLX", "GOOGL"],
  mag7: ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"],
  mostActive: ["TSLA", "NVDA", "AAPL", "AMD", "PLTR", "SOFI", "F", "NIO", "LCID", "RIVN"]
};
class Kt {
  constructor(e = qt) {
    this.baseURL = e;
  }
  // Helper method for API calls
  async fetchAPI(e, t = {}) {
    const s = `${this.baseURL}${e}`, n = await fetch(s, {
      ...t,
      headers: {
        "Content-Type": "application/json",
        ...t.headers
      }
    });
    if (!n.ok) {
      const r = await n.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(r.detail || `API error: ${n.statusText}`);
    }
    return n.json();
  }
  // Health Check
  async getHealth() {
    const e = await this.fetchAPI("/trading-agents");
    return {
      status: "online",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      services: {
        news_researcher: "online",
        debate_analyst: "online"
      },
      ...e
    };
  }
  // Get Agent Execution Logs
  async getAgentLogs(e = 50) {
    return this.fetchAPI(`/trading-agents?action=history&limit=${e}`);
  }
  // News Researcher (Adapted to TradingAgents) Methods
  async analyzeWithNewsResearcher(e) {
    const t = e.symbols[0], s = await this.fetchAPI("/trading-agents", {
      method: "POST",
      body: JSON.stringify({
        symbol: t,
        date: e.date,
        analysts: ["news", "fundamentals", "market"]
      })
    });
    return {
      success: s.success,
      symbols: [s.symbol],
      date: s.date,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      result: {
        portfolio_manager_results: {
          decision: s.signal.action,
          confidence: s.signal.confidence,
          reasoning: s.signal.reasoning
        },
        news_intelligence_results: {
          summary: s.analysis.newsReport
        },
        technical_analysis_results: {
          summary: s.analysis.marketReport
        },
        data_collection_results: {
          summary: s.analysis.fundamentalsReport
        }
      }
    };
  }
  async batchAnalyzeWithNewsResearcher(e) {
    throw new Error("Batch analysis not supported in this version");
  }
  // Debate Analyst (TradingAgents) Methods
  async analyzeWithDebateAnalyst(e) {
    const t = await this.fetchAPI("/trading-agents", {
      method: "POST",
      body: JSON.stringify({
        symbol: e.symbol,
        date: e.date,
        config: {
          deepThinkLLM: e.deep_think_llm,
          quickThinkLLM: e.quick_think_llm
        }
      })
    });
    return {
      success: t.success,
      symbol: t.symbol,
      date: t.date,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      decision: {
        action: t.signal.action,
        confidence: t.signal.confidence,
        position_size: 1,
        // Default as not in TradingAgentsResponse
        reasoning: t.signal.reasoning,
        debate_summary: t.analysis.investmentDebate ? {
          bull_arguments: [t.analysis.investmentDebate.bullArguments],
          bear_arguments: [t.analysis.investmentDebate.bearArguments],
          risk_assessment: "See full analysis for risk details"
        } : void 0
      }
    };
  }
  async reflectOnTrade(e) {
    return { success: !0 };
  }
  async getDebateAnalystConfig() {
    return { success: !0 };
  }
  // Backtesting Methods
  async runBacktest(e) {
    const t = await this.fetchAPI("/backtest", {
      method: "POST",
      body: JSON.stringify({
        symbol: e.symbol,
        startDate: "2023-01-01",
        // Default dates if needed
        endDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        strategy: "momentum"
      })
    });
    return {
      success: t.success,
      symbol: t.symbol,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      primo_results: {
        "Starting Portfolio Value [$]": t.initialCapital,
        "Final Portfolio Value [$]": t.finalValue,
        "Cumulative Return [%]": t.totalReturnPercent,
        "Annual Return [%]": 0,
        // Not calc
        "Annual Volatility [%]": 0,
        // Not calc
        "Sharpe Ratio": t.metrics.sharpeRatio || 0,
        "Max Drawdown [%]": t.metrics.maxDrawdown,
        "Total Trades": t.metrics.totalTrades,
        "Win Rate [%]": t.metrics.winRate
      },
      buyhold_results: {
        "Cumulative Return [%]": 0,
        // Needs fetch
        "Annual Return [%]": 0,
        "Sharpe Ratio": 0,
        "Max Drawdown [%]": 0
      },
      comparison: {
        relative_return: 0,
        outperformed: t.totalReturn > 0,
        metrics: {
          cumulative_return_diff: 0,
          volatility_diff: 0,
          max_drawdown_diff: 0,
          sharpe_diff: 0
        }
      }
    };
  }
  async getAvailableStocks(e = "./output/csv") {
    return { success: !0, files: [] };
  }
  // Batch Methods for Multiple Stocks
  async analyzeTopStocks(e = "mag7", t = "news-researcher") {
    const s = Wt[e];
    return t === "news-researcher" ? await Promise.allSettled(
      s.map(
        (r) => this.analyzeWithNewsResearcher({ symbols: [r] })
      )
    ) : await Promise.allSettled(
      s.map(
        (r) => this.analyzeWithDebateAnalyst({ symbol: r })
      )
    );
  }
  async batchBacktest(e) {
    return await Promise.allSettled(
      e.map((s) => this.runBacktest({ symbol: s }))
    );
  }
}
const j = new Kt();
async function Ls(a, e = "debate-analyst") {
  return e === "news-researcher" ? j.analyzeWithNewsResearcher({ symbols: [a] }) : j.analyzeWithDebateAnalyst({ symbol: a });
}
async function Cs(a = "mag7", e = "news-researcher") {
  return j.analyzeTopStocks(a, e);
}
async function Ms(a) {
  return j.runBacktest({ symbol: a });
}
async function Is() {
  return j.getHealth();
}
const Rs = {
  health: ["health"],
  newsResearcher: (a) => ["news-researcher", ...a],
  debateAnalyst: (a) => ["debate-analyst", a],
  backtest: (a) => ["backtest", a],
  availableStocks: ["available-stocks"],
  topStocks: (a, e) => ["top-stocks", a, e]
}, Vt = "./data/leaders.json";
class Ht {
  constructor() {
    this.getTraderRankings = async (e = "1mo") => (await this.api("/market/ranks", {
      time: e,
      engines: ["stocks"]
    }))?.data?.data.map((t) => ({
      id: t.id,
      name: t.name,
      rank: t.rank,
      rep: t.rep,
      trades: t.trades,
      winRate: Math.floor(t.winRate),
      totalGain: Math.floor(t.totalGain),
      avgReturn: Math.floor(t.avgReturn)
    })), this.getTraderTrades = async (e, t = "1mo") => (await this.api("/accounts/trades", {
      id: e,
      filter: {
        frame: t,
        engines: ["options", "stocks", "crypto", "forex"]
      }
    }))?.data?.data.map((s) => (qe(s), {
      symbol: s.symbol,
      type: s.type == "short" ? "short" : s.closed ? "sell" : "buy",
      // entryPrice: trade.entryPrice,
      // exitPrice: trade.exitPrice,
      time: new Date(s.lastModified).toISOString(),
      price: Number(s.price.toFixed(2)),
      ...(s.type == "short" || s.closed) && {
        previousPrice: Number(s.previousEntryPrice.toFixed(2))
      },
      ...s.closed && { gain: Math.floor(s.gain) }
    })), this.api = We.instance({
      baseURL: "https://db.nvstly.com/api",
      post: !0,
      compress: !1
    });
  }
}
const le = new Ht();
async function Jt() {
  const a = await le.getTraderRankings();
  a.forEach((e) => {
  }), console.log(`Found ${a.length} traders`);
  for (let e = 0; e < a.length; e++) {
    const s = a[e].id;
    a[e].orders = await le.getTraderTrades(s), console.log(
      `  Added ${a[e].orders.length} trades for ${a[e].name}`
    ), await Ke.writeFile(Vt, JSON.stringify(a, null, 2)), a[e].orders[2], await new Promise((n) => setTimeout(n, 1e3));
  }
}
Jt();
async function Gt() {
  const a = await fetch(
    "https://www.zulutrade.com/zulutrade-gateway/api/providers/performance/topTraders/75932/search?flavorId=1&accessingFlavorId=1",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      }
    }
  );
  if (!a.ok) throw new Error(`Zulu fetch failed: ${a.status}`);
  return (await a.json()).result || [];
}
async function Yt(a) {
  const e = await fetch(
    `https://www.zulutrade.com/zulutrade-gateway/v2/api/providers/${a}/thi/init?accessingFlavorId=1&flavor=global`,
    {
      headers: {
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      }
    }
  );
  if (!e.ok) throw new Error(`Zulu trader detail fetch failed: ${e.status}`);
  return await e.json();
}
async function fe(a) {
  const e = Date.now();
  for (const t of a) {
    const s = t.trader, n = s.profile, r = s.overallStats, i = r.timeframeStats || {}, l = Object.values(i)[0] || {};
    await w.insert(T).values({
      providerId: s.providerId,
      name: n.name,
      strategyDesc: n.strategyDesc || null,
      countryCode: n.countryIsoCode,
      countryName: n.countryName,
      brokerName: n.brokerName,
      balance: r.balance || 0,
      equity: r.equity || 0,
      followers: r.followers || 0,
      liveFollowers: r.liveFollowers || 0,
      roiAnnualized: r.roiAnnualized || 0,
      roiProfit: r.roiProfit || 0,
      zuluRank: r.zuluRank || 0,
      bestTrade: r.bestTrade || 0,
      worstTrade: r.worstTrade || 0,
      profitableTrades: r.profitableTrades || 0,
      losingTrades: r.losingTrades || 0,
      avgDrawdown: r.avgDrawdown || 0,
      maxDrawdown: r.overallDrawDownInMoney || 0,
      maxDrawdownPercent: l.maxDrawDownPercent || 0,
      leverage: n.leverage || 0,
      isEa: s.badges?.ea ? 1 : 0,
      currencies: r.providerCurrencies || "",
      weeks: r.weeks || 0,
      demo: n.demo ? 1 : 0,
      avgTradeSeconds: l.avgTradeSeconds || 0,
      avgPnlPerTrade: l.avgPnlPerTrade || 0,
      winRate: l.winTrades || 0,
      totalTrades: l.trades || 0,
      pageVisits: n.pageVisits || 0,
      includedInWatchlist: r.includedInWatchlist || 0,
      registrationDate: n.registrationDate ? new Date(n.registrationDate) : null,
      lastOpenTradeDate: r.lastOpenTradeDate ? new Date(r.lastOpenTradeDate) : null,
      updatedAt: new Date(e)
    }).onConflictDoUpdate({
      target: T.providerId,
      set: {
        name: n.name,
        strategyDesc: n.strategyDesc || null,
        countryCode: n.countryIsoCode,
        countryName: n.countryName,
        brokerName: n.brokerName,
        balance: r.balance || 0,
        equity: r.equity || 0,
        followers: r.followers || 0,
        liveFollowers: r.liveFollowers || 0,
        roiAnnualized: r.roiAnnualized || 0,
        roiProfit: r.roiProfit || 0,
        zuluRank: r.zuluRank || 0,
        bestTrade: r.bestTrade || 0,
        worstTrade: r.worstTrade || 0,
        profitableTrades: r.profitableTrades || 0,
        losingTrades: r.losingTrades || 0,
        avgDrawdown: r.avgDrawdown || 0,
        maxDrawdown: r.overallDrawDownInMoney || 0,
        maxDrawdownPercent: l.maxDrawDownPercent || 0,
        leverage: n.leverage || 0,
        isEa: s.badges?.ea ? 1 : 0,
        currencies: r.providerCurrencies || "",
        weeks: r.weeks || 0,
        demo: n.demo ? 1 : 0,
        avgTradeSeconds: l.avgTradeSeconds || 0,
        avgPnlPerTrade: l.avgPnlPerTrade || 0,
        winRate: l.winTrades || 0,
        totalTrades: l.trades || 0,
        pageVisits: n.pageVisits || 0,
        includedInWatchlist: r.includedInWatchlist || 0,
        registrationDate: n.registrationDate ? new Date(n.registrationDate) : null,
        lastOpenTradeDate: r.lastOpenTradeDate ? new Date(r.lastOpenTradeDate) : null,
        updatedAt: new Date(e)
      }
    }), s.currencyStats && s.currencyStats.length > 0 && await Zt(s.providerId, s.currencyStats);
  }
}
async function Zt(a, e) {
  const t = Date.now();
  for (const s of e) {
    const n = `${a}-${s.currencyName}`;
    await w.insert(V).values({
      id: n,
      providerId: a,
      currencyName: s.currencyName,
      totalCount: s.totalCurrencyCount || 0,
      winCount: s.currencyWinCount || 0,
      winPercent: s.currencyWinPercent || 0,
      totalBuyCount: s.totalCurrencyBuyCount || 0,
      totalSellCount: s.totalCurrencySellCount || 0,
      pips: s.pips || 0,
      createdAt: new Date(t)
    }).onConflictDoUpdate({
      target: V.id,
      set: {
        totalCount: s.totalCurrencyCount || 0,
        winCount: s.currencyWinCount || 0,
        winPercent: s.currencyWinPercent || 0,
        totalBuyCount: s.totalCurrencyBuyCount || 0,
        totalSellCount: s.totalCurrencySellCount || 0,
        pips: s.pips || 0
      }
    });
  }
}
async function $s(a = 50) {
  return await w.select().from(T).orderBy(x(T.roiAnnualized)).limit(a);
}
async function Os(a) {
  const e = await w.select().from(T).where(R(T.providerId, a)).limit(1);
  if (e.length === 0) return null;
  const t = await w.select().from(V).where(R(V.providerId, a));
  return {
    ...e[0],
    currencyStats: t
  };
}
async function Es(a = 50) {
  return await w.select().from(T).orderBy(ue(T.zuluRank)).limit(a);
}
async function xs(a) {
  let e = w.select().from(T);
  return a.minRoi && (e = e.where(te`${T.roiAnnualized} >= ${a.minRoi}`)), a.minWinRate && (e = e.where(te`${T.winRate} >= ${a.minWinRate}`)), a.maxDrawdown && (e = e.where(te`${T.maxDrawdownPercent} <= ${a.maxDrawdown}`)), a.isEa !== void 0 && (e = e.where(R(T.isEa, a.isEa ? 1 : 0))), await e.orderBy(x(T.roiAnnualized)).limit(a.limit || 50);
}
async function zs() {
  console.log("Starting Zulu sync...");
  const a = await Gt();
  return await fe(a), console.log(`Saved ${a.length} Zulu traders`), { traders: a.length };
}
async function Us(a) {
  console.log(`Syncing details for ${a.length} traders...`);
  const e = [];
  for (const t of a)
    try {
      const s = await Yt(t);
      e.push(s), await new Promise((n) => setTimeout(n, 500));
    } catch (s) {
      console.error(`Failed to fetch trader ${t}:`, s.message);
    }
  return e.length > 0 && await fe(e.map((t) => ({ trader: t.trader.stats }))), console.log(`Saved ${e.length} trader details`), { details: e.length };
}
const Xt = new Ve({
  apiKey: process.env.TAVILY_API_KEY
});
async function we(a) {
  const e = await Xt.search({
    query: a,
    searchDepth: "advanced",
    maxResults: 5,
    includeRawContent: !0,
    // so we can skip a separate extract call if desired [web:71][web:75][web:80]
    topic: "general"
  }), t = [];
  if (e?.answer && t.push(`High-level answer: ${e.answer}`), e?.results?.length)
    for (const s of e.results.slice(0, 3)) {
      const n = (s.rawContent ?? s.content ?? "").slice(0, 800);
      t.push(
        `Source: ${s.url}
Relevance: ${s.score}
Snippet:
${n}`
      );
    }
  return t.join(`

`);
}
function ve(a, e, t) {
  const s = `You are an expert analyst tasked with providing a balanced debate analysis for a prediction market question.

Market Question: ${a.question}
${a.description ? `Description: ${a.description}` : ""}

Current Polymarket displayed odds:
- YES: ${a.currentYesPrice}
- NO: ${a.currentNoPrice}

Note: These displayed odds are a UI placeholder and do NOT necessarily reflect true market probabilities. Use them only as a reference for comparison, not as ground truth. [web:89][web:92][web:96]

${a.volume24hr ? `24h Volume: $${a.volume24hr.toLocaleString()}` : ""}
${a.volumeTotal ? `Total Volume: $${a.volumeTotal.toLocaleString()}` : ""}

You have the following external research about this question from web search (via Tavily). Use it heavily for factual grounding:

${e}

Your tasks:
1. Infer your own best-estimate probability for YES and NO based on the research, expressed as numbers between 0 and 1 that sum to 1.0.
2. Provide a full debate analysis (arguments, summaries, key factors, uncertainties).
3. Explain how and why your inferred probabilities differ from the displayed 50/50 odds.

Respond with valid JSON in this format:

{
  "yesArguments": ["argument 1", "argument 2", "argument 3"],
  "noArguments": ["argument 1", "argument 2", "argument 3"],
  "yesSummary": "2-3 sentence summary of the strongest case for YES",
  "noSummary": "2-3 sentence summary of the strongest case for NO",
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "uncertainties": ["uncertainty 1", "uncertainty 2"],
  "modelYesProbability": 0.63,
  "modelNoProbability": 0.37,
  "commentaryOnDiscrepancy": "2-4 sentences explaining why your inferred odds differ from the 50/50 displayed odds."
}

Guidelines:
1. Be intellectually honest and balanced - present the strongest arguments for BOTH sides.
2. Base arguments primarily on the provided research, plus relevant facts, data, historical precedent, and logical reasoning. [web:85][web:87][web:90]
3. Explicitly justify your probability estimates using the research (e.g., base rates, polls, fundamentals, historical analogies).
4. Highlight structural reasons the displayed 50/50 odds might deviate from “true odds” (e.g., low liquidity, retail bias, information lags). [web:89][web:92][web:94][web:99]
5. Each argument should be specific and substantive (2-3 sentences).
6. Key factors should be concrete, measurable events or conditions.
7. Focus on factors that are actually relevant to the prediction timeframe.
8. Avoid simply repeating the 50/50 odds; your probabilities should reflect your best judgment based on the research, even if far from 50/50.

`;
  return t ? s + `
Return ONLY the JSON object, with no additional text or explanation.` : s;
}
async function ke(a, e, {
  model: t = "llama-3.3-70b-versatile",
  temperature: s = 0.7
} = {}) {
  const r = await new He({
    apiKey: e || process.env.GROQ_API_KEY,
    model: t,
    temperature: s
  }).invoke(
    [
      {
        role: "system",
        content: "You are an expert analyst who provides balanced, fact-based debate analysis. Always respond with valid JSON matching the requested schema."
      },
      {
        role: "user",
        content: a
      }
    ],
    {
      response_format: { type: "json_object" }
    }
  );
  let l = (typeof r.content == "string" ? r.content : Array.isArray(r.content) ? r.content.map((u) => u?.text ?? "").join("") : String(r.content)).trim();
  const d = JSON.parse(l);
  if (!d.yesArguments || !d.noArguments || !d.yesSummary || !d.noSummary || !d.keyFactors || !d.uncertainties)
    throw new Error("Missing required fields in analysis");
  return d;
}
async function Fs(a, e) {
  const t = await we(a.question), s = ve(a, t, !0);
  return ke(s, e);
}
async function Bs(a, e) {
  const t = await we(a.question), s = ve(a, t, !1);
  return ke(s, e);
}
async function Qt(a = 50, e = "volume24hr") {
  const t = "https://gamma-api.polymarket.com", s = new URL(`${t}/markets`);
  s.searchParams.set("closed", "false"), s.searchParams.set("active", "true"), s.searchParams.set("limit", String(a)), s.searchParams.set("order", e), s.searchParams.set("ascending", "false");
  const n = await fetch(s, {
    headers: { accept: "application/json" },
    cache: "no-store"
  });
  if (!n.ok) throw new Error(`markets fetch failed: ${n.status}`);
  return await n.json();
}
async function ea(a = {}) {
  const {
    timePeriod: e = "all",
    orderBy: t = "VOL",
    limit: s = 20,
    offset: n = 0,
    category: r = "overall"
  } = a, i = new URL("https://data-api.polymarket.com/v1/leaderboard");
  i.searchParams.set("timePeriod", e), i.searchParams.set("orderBy", t), i.searchParams.set("limit", String(s)), i.searchParams.set("offset", String(n)), i.searchParams.set("category", r);
  const l = await fetch(i, {
    headers: { accept: "application/json" },
    cache: "no-store"
  });
  if (!l.ok) throw new Error(`leaderboard fetch failed: ${l.status}`);
  return await l.json();
}
async function ta(a = 50) {
  const e = await fetch("https://polymarketanalytics.com/api/traders-tag-performance", {
    method: "POST",
    headers: {
      accept: "*/*",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      tag: "Overall",
      sortColumn: "overall_gain",
      sortDirection: "DESC",
      minPnL: -4534159552280787e-9,
      maxPnL: 320323291229432e-8,
      minActivePositions: 0,
      maxActivePositions: 38642,
      minWinAmount: 0,
      maxWinAmount: 20316723043360095e-9,
      minLossAmount: -20494980369057264e-9,
      maxLossAmount: 0,
      minWinRate: 0,
      maxWinRate: 100,
      minCurrentValue: 0,
      maxCurrentValue: 1e12,
      minTotalPositions: 1,
      maxTotalPositions: 56928
    })
  });
  if (!e.ok) throw new Error(`leaders fetch failed: ${e.status}`);
  const t = await e.json();
  let s = [];
  if (Array.isArray(t))
    s = t;
  else if (t && Array.isArray(t.data))
    s = t.data;
  else
    return console.error("Polymarket API returned non-array:", JSON.stringify(t)), [];
  return s.slice(0, a);
}
async function aa(a) {
  const e = await fetch("https://polymarketanalytics.com/api/traders-positions", {
    method: "POST",
    headers: {
      accept: "*/*",
      "content-type": "application/json"
    },
    body: JSON.stringify({ trader_id: a })
  });
  if (!e.ok) throw new Error(`positions fetch failed: ${e.status}`);
  return await e.json();
}
async function js(a) {
  const e = "https://gamma-api.polymarket.com", t = new URL(`${e}/markets/${a}/order-book`), s = await fetch(t, {
    headers: { accept: "application/json" },
    cache: "no-store"
  });
  return s.ok ? await s.json() : (console.error(`Order book fetch failed for market ${a}: ${s.status}`), null);
}
async function qs(a) {
  const e = "https://gamma-api.polymarket.com", t = new URL(`${e}/markets/${a}`), s = await fetch(t, {
    headers: { accept: "application/json" },
    cache: "no-store"
  });
  return s.ok ? await s.json() : (console.error(`Market details fetch failed for market ${a}: ${s.status}`), null);
}
async function sa(a) {
  const e = Date.now();
  for (const t of a)
    await w.insert($).values({
      trader: t.trader,
      overallGain: t.overall_gain || 0,
      winRate: t.win_rate || 0,
      activePositions: t.active_positions || 0,
      totalPositions: t.total_positions || 0,
      currentValue: t.current_value || 0,
      winAmount: t.win_amount || 0,
      lossAmount: t.loss_amount || 0,
      updatedAt: new Date(e)
    }).onConflictDoUpdate({
      target: $.trader,
      set: {
        overallGain: t.overall_gain || 0,
        winRate: t.win_rate || 0,
        activePositions: t.active_positions || 0,
        totalPositions: t.total_positions || 0,
        currentValue: t.current_value || 0,
        winAmount: t.win_amount || 0,
        lossAmount: t.loss_amount || 0,
        updatedAt: new Date(e)
      }
    });
}
async function na(a) {
  const e = Date.now();
  for (const t of a)
    await w.insert($).values({
      trader: t.proxyWallet,
      rank: parseInt(t.rank),
      userName: t.userName || null,
      xUsername: t.xUsername || null,
      verifiedBadge: t.verifiedBadge || !1,
      profileImage: t.profileImage || null,
      vol: t.vol || 0,
      pnl: t.pnl || 0,
      updatedAt: new Date(e)
    }).onConflictDoUpdate({
      target: $.trader,
      set: {
        rank: parseInt(t.rank),
        userName: t.userName || null,
        xUsername: t.xUsername || null,
        verifiedBadge: t.verifiedBadge || !1,
        profileImage: t.profileImage || null,
        vol: t.vol || 0,
        pnl: t.pnl || 0,
        updatedAt: new Date(e)
      }
    });
}
async function ra(a, e) {
  const t = Date.now();
  for (const s of e) {
    const n = JSON.stringify(s.tags || s.market_tags || []), r = `${a}-${s.market_id || s.id || Math.random()}`;
    await w.insert(H).values({
      id: r,
      traderId: a,
      marketId: s.market_id || s.id,
      marketTitle: s.market_title || s.title || "",
      cashPnl: s.cashPnl || s.cash_pnl || 0,
      realizedPnl: s.realizedPnl || s.realized_pnl || 0,
      tags: n,
      createdAt: new Date(t)
    }).onConflictDoUpdate({
      target: H.id,
      set: {
        cashPnl: s.cashPnl || s.cash_pnl || 0,
        realizedPnl: s.realizedPnl || s.realized_pnl || 0,
        tags: n
      }
    });
  }
}
async function oa(a) {
  const e = Date.now();
  await w.delete(U);
  for (const t of a)
    await w.insert(U).values({
      tag: t.tag,
      pnl: t.pnl,
      updatedAt: new Date(e)
    });
}
async function ia(a) {
  const e = Date.now();
  for (const t of a)
    await w.insert(C).values({
      id: t.id,
      question: t.question,
      slug: t.slug,
      description: t.description || null,
      image: t.imageUrl || t.image || null,
      volume24hr: t.volume24hr || 0,
      volumeTotal: t.volumeNum || t.volumeTotal || 0,
      active: t.active ?? !0,
      closed: t.closed ?? !1,
      outcomes: JSON.parse(t.outcomes || []),
      outcomePrices: JSON.parse(t.outcomePrices || []),
      tags: JSON.stringify(t.tags || []),
      endDate: t.endDate || null,
      groupItemTitle: t.groupItemTitle || null,
      enableOrderBook: t.enableOrderBook ?? !1,
      createdAt: new Date(e),
      updatedAt: new Date(e)
    }).onConflictDoUpdate({
      target: C.id,
      set: {
        question: t.question,
        description: t.description || null,
        image: t.imageUrl || t.image || null,
        volume24hr: t.volume24hr || 0,
        volumeTotal: t.volumeNum || t.volumeTotal || 0,
        active: t.active ?? !0,
        closed: t.closed ?? !1,
        outcomes: JSON.parse(t.outcomes || []),
        outcomePrices: JSON.parse(t.outcomePrices || []),
        tags: JSON.stringify(t.tags || []),
        endDate: t.endDate || null,
        groupItemTitle: t.groupItemTitle || null,
        enableOrderBook: t.enableOrderBook ?? !1,
        updatedAt: new Date(e)
      }
    });
}
async function Ws(a, e) {
  const t = Date.now();
  if (await w.delete(E).where(R(E.marketId, a)), !(!e || !e.bids || !e.asks)) {
    for (const s of e.bids || []) {
      const n = `${a}-buy-${s.price}-${Date.now()}-${Math.random()}`;
      await w.insert(E).values({
        id: n,
        marketId: a,
        outcome: s.outcome || "Yes",
        price: s.price || 0,
        size: s.size || 0,
        side: "buy",
        totalValue: (s.price || 0) * (s.size || 0),
        createdAt: new Date(t)
      });
    }
    for (const s of e.asks || []) {
      const n = `${a}-sell-${s.price}-${Date.now()}-${Math.random()}`;
      await w.insert(E).values({
        id: n,
        marketId: a,
        outcome: s.outcome || "No",
        price: s.price || 0,
        size: s.size || 0,
        side: "sell",
        totalValue: (s.price || 0) * (s.size || 0),
        createdAt: new Date(t)
      });
    }
  }
}
async function Ks(a, e) {
  const t = Date.now(), s = `debate-${a}`;
  await w.insert(J).values({
    id: s,
    marketId: a,
    question: e.question,
    yesArguments: JSON.stringify(e.yesArguments),
    noArguments: JSON.stringify(e.noArguments),
    yesSummary: e.yesSummary,
    noSummary: e.noSummary,
    keyFactors: JSON.stringify(e.keyFactors),
    uncertainties: JSON.stringify(e.uncertainties),
    currentYesPrice: e.currentYesPrice,
    currentNoPrice: e.currentNoPrice,
    llmProvider: e.llmProvider || null,
    model: e.model || null,
    createdAt: new Date(t),
    updatedAt: new Date(t)
  }).onConflictDoUpdate({
    target: J.marketId,
    set: {
      question: e.question,
      yesArguments: JSON.stringify(e.yesArguments),
      noArguments: JSON.stringify(e.noArguments),
      yesSummary: e.yesSummary,
      noSummary: e.noSummary,
      keyFactors: JSON.stringify(e.keyFactors),
      uncertainties: JSON.stringify(e.uncertainties),
      currentYesPrice: e.currentYesPrice,
      currentNoPrice: e.currentNoPrice,
      llmProvider: e.llmProvider || null,
      model: e.model || null,
      updatedAt: new Date(t)
    }
  });
}
async function Vs(a = "vol", e = 50) {
  const t = a === "vol" ? $.vol : a === "pnl" ? $.pnl : $.overallGain;
  return await w.select().from($).orderBy(x(t)).limit(e);
}
async function Hs(a) {
  return await w.select().from(H).where(R(H.traderId, a));
}
async function Js() {
  const a = await w.select().from(U).orderBy(x(U.pnl)).limit(20), e = await w.select().from(U).orderBy(ue(U.pnl)).limit(20);
  return { best: a, worst: e };
}
async function Gs(a = {}) {
  const {
    limit: e = 50,
    sortBy: t = "volume24hr",
    category: s,
    activeOnly: n = !0
  } = a;
  let r = w.select().from(C);
  n && (r = r.where(R(C.active, !0)));
  const i = t === "volume24hr" ? C.volume24hr : t === "volumeTotal" ? C.volumeTotal : C.createdAt;
  r = r.orderBy(x(i)), r = r.limit(e);
  const l = await r;
  return s ? l.filter((d) => {
    try {
      return JSON.parse(d.tags || "[]").includes(s);
    } catch {
      return !1;
    }
  }) : l;
}
async function Ys() {
  const a = await w.select().from(C).where(R(C.active, !0)).orderBy(x(C.volume24hr)).limit(100), e = {};
  for (const t of a)
    try {
      const s = JSON.parse(t.tags || "[]");
      for (const n of s)
        e[n] || (e[n] = []), e[n].push(t);
    } catch {
    }
  return e;
}
async function Zs(a) {
  return await w.select().from(E).where(R(E.marketId, a)).orderBy(x(E.totalValue));
}
async function Xs(a) {
  const e = await w.select().from(J).where(R(J.marketId, a)).limit(1);
  return e.length > 0 ? e[0] : null;
}
function la(a) {
  const e = /* @__PURE__ */ new Map();
  for (const r of a) {
    const i = Number(r.cash_pnl || r.cashPnl || r.realized_pnl || r.realizedPnl || 0);
    if (!i) continue;
    let l = r.tags || r.market_tags || [];
    if (typeof l == "string")
      try {
        l = JSON.parse(l);
      } catch {
        l = [];
      }
    for (const d of l) {
      const u = e.get(d) || 0;
      e.set(d, u + i);
    }
  }
  const t = Array.from(e.entries()).map(([r, i]) => ({ tag: r, pnl: i }));
  t.sort((r, i) => i.pnl - r.pnl);
  const s = t.slice(0, 20), n = [...t].sort((r, i) => r.pnl - i.pnl).slice(0, 20);
  return { best: s, worst: n };
}
async function ca(a = 100) {
  console.log("Starting Polymarket markets sync..."), await w.delete(C);
  const e = await Qt(a, "volume24hr");
  return await ia(e), console.log(`Saved ${e.length} markets`), { markets: e.length };
}
async function da(a = {}) {
  console.log("Starting Polymarket leaderboard sync...");
  const e = await ea(a);
  return await na(e), console.log(`Saved ${e.length} leaderboard entries`), { leaders: e.length };
}
async function ua() {
  console.log("Starting Polymarket sync...");
  const a = await ta(50);
  await sa(a), console.log(`Saved ${a.length} leaders`);
  const e = [];
  for (const s of a) {
    const n = s.trader, r = await aa(n);
    await ra(n, r), e.push(...r), console.log(`Saved positions for trader ${n}`);
  }
  const t = la(e);
  return await oa([...t.best, ...t.worst]), console.log(`Saved ${t.best.length + t.worst.length} categories`), { leaders: a.length, positions: e.length };
}
async function Qs() {
  console.log("Starting full Polymarket sync...");
  const a = await ca(), e = await da({ limit: 100, orderBy: "VOL" }), t = await ua();
  return {
    markets: a.markets,
    leaderboard: e.leaders,
    leaders: t.leaders,
    positions: t.positions
  };
}
const ce = "data/stock-names.json", Y = "data/sectors-industries.json", ae = {
  fields: ["symbol", "name", "industryId", "marketCap", "cik"]
}, ma = "https://scanner.tradingview.com/america/scan", pa = ["nasdaq", "nyse", "amex"], ya = "https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true", ga = 0, ha = [
  " American Depositary Shares",
  " Depositary Shares",
  " Ordinary Shares",
  " Common Stock",
  " Common Shares",
  " Capital Stock",
  " Units",
  " Warrants",
  " Warrant",
  " Rights",
  " Preferred Stock",
  " Preferred Shares",
  " Depositary Share",
  // Singular
  " Ordinary Share",
  // Singular
  " Common Share"
  // Singular
], de = (a) => {
  let e = a;
  for (const t of ha) {
    const s = new RegExp(t + ".*$", "i");
    if (s.test(e)) {
      e = e.replace(s, "");
      break;
    }
  }
  return e;
}, fa = (a) => {
  if (!a) return 0;
  const e = parseFloat(String(a).replace(/,/g, "").replace(/\$/g, ""));
  return isNaN(e) ? 0 : Math.round(e / 1e6);
};
function wa() {
  if (I.existsSync(Y))
    try {
      const a = JSON.parse(I.readFileSync(Y, "utf-8"));
      console.log(`Loaded existing mappings: ${Object.keys(a.sectors || {}).length} sectors, ${Object.keys(a.industries || {}).length} industries`);
      const e = {}, t = {};
      for (const [s, n] of Object.entries(a.sectors || {}))
        e[n] = s;
      for (const [s, n] of Object.entries(a.industries || {}))
        t[n] = s;
      return {
        sectors: a.sectors || {},
        industries: a.industries || {},
        sectorsReverse: e,
        industriesReverse: t,
        industryToSector: a.industryToSector || {}
      };
    } catch (a) {
      console.warn("Error loading existing mappings, starting fresh:", a);
    }
  return {
    sectors: {},
    industries: {},
    sectorsReverse: {},
    industriesReverse: {},
    industryToSector: {}
  };
}
function W(a, e, t) {
  if (e[a])
    return e[a];
  const s = Object.values(e), n = s.length > 0 ? Math.max(...s) + 1 : 1;
  return e[a] = n, t[n] = a, n;
}
async function va() {
  const a = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:85.0) Gecko/20100101 Firefox/85.0",
      "Content-Type": "application/json"
    }
  };
  try {
    console.log("Fetching symbols from TradingView...");
    const e = await fetch(ma, a);
    if (!e.ok)
      throw new Error(`TradingView request failed. Status Code: ${e.status}`);
    const t = await e.json(), s = /* @__PURE__ */ new Set();
    return t.data && Array.isArray(t.data) && t.data.forEach((n) => {
      if (n.s) {
        const [r, i] = n.s.split(":");
        r && i && ["NYSE", "NASDAQ", "AMEX"].includes(r.toUpperCase()) && s.add(i);
      }
    }), console.log(`Fetched ${s.size} symbols from TradingView (NYSE, NASDAQ, AMEX only)`), console.log(`Total count from TradingView: ${t.totalCount || 0}`), s;
  } catch (e) {
    return console.error("Error fetching TradingView symbols:", e), /* @__PURE__ */ new Set();
  }
}
async function ka(a) {
  const e = `${ya}&exchange=${a}`, t = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:85.0) Gecko/20100101 Firefox/85.0"
    }
  };
  try {
    const s = await fetch(e, t);
    if (!s.ok)
      throw new Error(`Request failed. Status Code: ${s.status}`);
    return await s.json();
  } catch (s) {
    return console.error(`Error fetching ${a}:`, s), null;
  }
}
async function _a() {
  const a = "data/company_tickers.json";
  try {
    if (console.log("Loading SEC CIK data from local file..."), !I.existsSync(a))
      return console.warn(`SEC data file not found: ${a}`), console.warn("Skipping CIK data. Download from: https://www.sec.gov/files/company_tickers.json"), { tickerToCik: /* @__PURE__ */ new Map(), secCompanies: /* @__PURE__ */ new Map() };
    const e = I.readFileSync(a, "utf-8"), t = JSON.parse(e), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
    return Object.values(t).forEach((r) => {
      r.ticker && r.cik_str && (s.set(r.ticker, r.cik_str), n.set(r.ticker, {
        ticker: r.ticker,
        name: r.title,
        cik: r.cik_str
      }));
    }), console.log(`Loaded ${s.size} SEC tickers with CIK numbers from local file`), { tickerToCik: s, secCompanies: n };
  } catch (e) {
    return console.error("Error loading SEC data:", e), { tickerToCik: /* @__PURE__ */ new Map(), secCompanies: /* @__PURE__ */ new Map() };
  }
}
async function ba() {
  try {
    console.log("Fetching stock data..."), I.existsSync("data") || I.mkdirSync("data");
    const a = wa(), [e, t, s] = await Promise.all([
      va(),
      Promise.all(pa.map(ka)),
      _a()
    ]), { tickerToCik: n, secCompanies: r } = s, i = [];
    t.forEach((p) => {
      p && p.data && p.data.rows && i.push(...p.data.rows);
    }), console.log(`Fetched ${i.length} total rows from NASDAQ/NYSE/AMEX.`);
    const l = /* @__PURE__ */ new Map();
    i.forEach((p) => {
      p.symbol && l.set(p.symbol.trim(), p);
    });
    const d = /* @__PURE__ */ new Map();
    e.forEach((p) => {
      if (!d.has(p)) {
        const A = l.get(p), N = n.get(p) || 0;
        if (A) {
          const D = A.sector ? String(A.sector).trim() : "Unknown", _ = A.industry ? String(A.industry).trim() : "Unknown", L = W(D, a.sectors, a.sectorsReverse), k = W(_, a.industries, a.industriesReverse);
          a.industryToSector[k] = L;
          const b = ae.fields.map((M) => M === "symbol" ? p : M === "name" ? de(A.name ? A.name.trim() : "") : M === "industryId" ? k : M === "marketCap" ? fa(A.marketCap) : M === "cik" ? N : A[M]);
          d.set(p, b);
        } else {
          const D = r.get(p), _ = W("Unknown", a.sectors, a.sectorsReverse), L = W("Unknown", a.industries, a.industriesReverse);
          a.industryToSector[L] = _;
          const k = ae.fields.map((b) => b === "symbol" ? p : b === "name" ? D ? de(D.name) : p : b === "industryId" ? L : b === "marketCap" ? 0 : b === "cik" ? N : 0);
          d.set(p, k);
        }
      }
    }), console.log(`Total unique tickers from TradingView core index: ${d.size}`), console.log(`Tickers with NASDAQ data: ${Array.from(d.values()).filter((p) => p[3] !== 0 && p[3] !== null).length}`), console.log(`Total sectors: ${Object.keys(a.sectors).length}`), console.log(`Total industries: ${Object.keys(a.industries).length}`), console.log(`Industry-to-Sector mappings: ${Object.keys(a.industryToSector).length}`), console.log(`Output fields: ${JSON.stringify(ae.fields)}`), I.writeFileSync(Y, JSON.stringify({
      sectors: a.sectors,
      industries: a.industries,
      industryToSector: a.industryToSector
    }, null, 2)), console.log(`Successfully wrote mappings to ${Y}`);
    const u = Array.from(d.values()).sort((p, A) => {
      const N = String(p[0] || ""), D = String(A[0] || "");
      return N.localeCompare(D);
    });
    I.writeFileSync(ce, JSON.stringify(u)), console.log(`Successfully wrote ${u.length} stocks to ${ce}`);
    const g = {}, y = {
      sector: "Overall US Public Stocks",
      totalCompanies: 0,
      totalMarketCap: 0,
      industries: {},
      companies: []
    };
    u.forEach((p) => {
      const A = p[0], N = p[1], D = p[2], _ = typeof p[3] == "number" ? p[3] : 0, L = a.industryToSector[D] || 0, k = a.sectorsReverse[L] || "Unknown", b = a.industriesReverse[D] || "Unknown";
      g[k] || (g[k] = {
        totalCompanies: 0,
        totalMarketCap: 0,
        industries: {},
        // Changed to object
        companies: []
      }), g[k].totalCompanies++, g[k].totalMarketCap += _, g[k].industries[b] || (g[k].industries[b] = {
        name: b,
        totalCompanies: 0,
        totalMarketCap: 0,
        leader: { symbol: A, name: N, _marketCap: _ }
      }), g[k].industries[b].totalCompanies++, g[k].industries[b].totalMarketCap += _, _ > g[k].industries[b].leader._marketCap && (g[k].industries[b].leader = { symbol: A, name: N, _marketCap: _ }), y.totalCompanies++, y.totalMarketCap += _, y.companies.push({ symbol: A, name: N, marketCap: _ });
    });
    const h = (p, A, N = !0) => {
      p.companies.sort((k, b) => b.marketCap - k.marketCap);
      const D = p.companies.slice(0, 10);
      let _ = [];
      N && (_ = Object.values(p.industries).sort((k, b) => b.totalMarketCap - k.totalMarketCap).map((k) => {
        const { _marketCap: b, ...M } = k.leader || {};
        return {
          ...k,
          leader: M
        };
      }));
      const L = {
        sector: A,
        totalCompanies: p.totalCompanies,
        totalMarketCap: p.totalMarketCap,
        top10Companies: D
      };
      return N && (L.industries = _), L;
    }, S = Object.keys(g).map((p) => h(g[p], p, !0));
    S.sort((p, A) => A.totalMarketCap - p.totalMarketCap), S.unshift(h(y, "Overall US Public Stocks", !1));
    const P = "data/sector-info.json";
    I.writeFileSync(P, JSON.stringify(S, null, 2)), console.log(`Successfully wrote to ${P}`);
  } catch (a) {
    console.error("An error occurred:", a), process.exit(1);
  }
}
ba();
const Aa = "/A", q = 10, Sa = "CIK{cik}.json", Pa = "https://data.sec.gov/submissions/{submission}", _e = /^\d{10}-\d{2}-\d{6}$/;
class en {
  constructor(e, t) {
    this._tickerToCikMapping = null, this._initPromise = null, this.companyName = e, this.emailAddress = t;
  }
  get userAgent() {
    return `${this.companyName} ${this.emailAddress}`;
  }
  async init() {
    return this._initPromise || (this._initPromise = this._loadTickerToCikMapping()), this._initPromise;
  }
  async _loadTickerToCikMapping() {
    this._tickerToCikMapping || (this._tickerToCikMapping = await Ta(this.userAgent));
  }
  async getFilingMetadatas(e, t = {}) {
    await this.init();
    const { includeAmends: s = !1 } = t;
    if (typeof e == "string") {
      const n = X.fromString(e, !1);
      n && (e = n);
    }
    if (e instanceof X)
      return [
        await Da({
          tickerOrCik: e.tickerOrCik,
          accessionNumber: e.accessionNumber,
          userAgent: this.userAgent,
          tickerToCikMapping: this._tickerToCikMapping,
          includeAmends: s
        })
      ];
    if (typeof e == "string" && (e = Z.fromString(e)), e instanceof Z)
      return await La({
        requested: e,
        userAgent: this.userAgent,
        tickerToCikMapping: this._tickerToCikMapping,
        includeAmends: s
      });
    throw new Error(`Invalid input: ${e}`);
  }
  async downloadFiling({ url: e }) {
    return await Na(e, this.userAgent);
  }
  async getFilingHtml(e = {}) {
    let { query: t, ticker: s, form: n } = e;
    if (t && (s || n))
      throw new Error("Error: Ticker or form should not be provided when query is specified.");
    if ((s || n) && t)
      throw new Error("Error: Query should not be provided when ticker or form is specified.");
    if ((s || n) && (t = `${s}/${n}`), !t)
      throw new Error("Error: Either query or ticker and form must be specified.");
    const r = await this.getFilingMetadatas(t);
    if (r.length === 0)
      throw new Error(`Could not find filing for ${t}`);
    if (r.length > 1)
      throw new Error(
        `Found multiple filings for ${t}. Use 'getFilingMetadatas()' and 'downloadFiling()' instead.`
      );
    return await this.downloadFiling({ url: r[0].primaryDocUrl });
  }
}
class Z {
  constructor(e, t, s = null) {
    this.tickerOrCik = e, this.formType = t, this.limit = s;
  }
  static fromString(e) {
    const t = e.split("/");
    if (t.length < 2)
      throw new Error(`Invalid query string format: ${e}`);
    const [s, n, r] = t, i = r ? parseInt(r) : null;
    return new Z(s, n, i);
  }
}
class X {
  constructor(e, t) {
    this.tickerOrCik = e, this.accessionNumber = t;
  }
  static fromString(e, t = !0) {
    const s = e.split("/");
    if (s.length === 2) {
      const [n, r] = s;
      if (_e.test(r) || r.length === 18)
        return new X(n, r);
    }
    if (t)
      throw new Error(`Invalid company and accession number format: ${e}`);
    return null;
  }
}
function be(a, e) {
  if (/^\d+$/.test(a))
    return a.padStart(q, "0");
  const t = e[a.toUpperCase()];
  if (!t)
    throw new Error(`Could not find CIK for ticker: ${a}`);
  return t.padStart(q, "0");
}
async function Ta(a) {
  try {
    const e = await import("fs/promises"), s = (await import("path")).join(__dirname, "../data", "company_tickers.json"), n = await e.readFile(s, "utf-8"), r = JSON.parse(n), i = {};
    if (Array.isArray(r)) {
      for (const l of r)
        if (l && l.length >= 3 && l[0] && l[2]) {
          const d = String(l[0]).padStart(q, "0"), u = l[2].toUpperCase();
          i[u] = d;
        }
    }
    return i;
  } catch {
    const s = await F.get("https://www.sec.gov/files/company_tickers.json", {
      headers: { "User-Agent": a }
    }), n = {}, r = s.data;
    for (const i in r) {
      const l = r[i];
      if (l.ticker && l.cik_str) {
        const d = String(l.cik_str).padStart(q, "0"), u = l.ticker.toUpperCase();
        n[u] = d;
      }
    }
    return n;
  }
}
async function Na(a, e) {
  try {
    const t = await F.get(a, {
      headers: { "User-Agent": e },
      responseType: "arraybuffer"
    });
    return Buffer.from(t.data);
  } catch (t) {
    throw new Error(`Failed to download filing from ${a}: ${t}`);
  }
}
async function Da(a) {
  const { tickerOrCik: e, accessionNumber: t, userAgent: s, tickerToCikMapping: n, includeAmends: r } = a;
  let i = t;
  if (t.length === 18 && (i = `${t.slice(0, 10)}-${t.slice(10, 12)}-${t.slice(12)}`), !_e.test(i))
    throw new Error(`Invalid Accession Number: ${t}`);
  const l = be(e, n), d = await Ae({
    cik: l,
    userAgent: s,
    limit: 1,
    accessionNumber: i,
    includeAmends: r
  });
  if (d.length === 0)
    throw new Error(`Could not find filing for ${t}`);
  return d[0];
}
async function La(a) {
  const { requested: e, userAgent: t, tickerToCikMapping: s, includeAmends: n } = a, r = be(e.tickerOrCik, s);
  let i;
  if (e.limit === null)
    i = Number.MAX_SAFE_INTEGER;
  else if (i = parseInt(String(e.limit)), i < 1)
    throw new Error("Invalid amount. Please enter a number greater than 1.");
  return await Ae({
    cik: r,
    userAgent: t,
    limit: i,
    tickerOrCik: e.tickerOrCik,
    formType: e.formType,
    includeAmends: n
  });
}
async function Ae(a) {
  const {
    cik: e,
    userAgent: t,
    limit: s,
    tickerOrCik: n,
    accessionNumber: r,
    formType: i,
    includeAmends: l = !1
  } = a, d = Sa.replace("{cik}", e), u = Pa.replace("{submission}", d), y = (await F.get(u, {
    headers: { "User-Agent": t }
  })).data, h = y.filings.recent, S = [], P = h.accessionNumber || [], p = h.primaryDocument || [], A = h.filingDate || [], N = h.reportDate || [], D = h.form || [];
  for (let _ = 0; _ < P.length && S.length < s; _++) {
    const L = P[_], k = p[_], b = A[_], M = N[_];
    let z = D[_];
    const oe = z.endsWith(Aa);
    if (z = oe ? z.slice(0, -2) : z, i && i !== z || r && r !== L || oe && !l)
      continue;
    const Se = L.replace(/-/g, ""), Pe = `https://www.sec.gov/Archives/edgar/data/${parseInt(e)}/${Se}/${k}`;
    S.push({
      primaryDocUrl: Pe,
      accessionNumber: L,
      tickers: (y.tickers || []).map((Te, Ne) => ({
        symbol: Te,
        exchange: y.exchanges?.[Ne] || ""
      })),
      companyName: y.name,
      filingDate: b,
      reportDate: M,
      primaryDocDescription: "",
      items: "",
      formType: z,
      cik: String(y.cik).padStart(q, "0")
    });
  }
  return S;
}
const O = new Je({ suppressNotices: ["ripHistorical"] });
class Ca {
  /**
   * Get historical price data for a symbol
   */
  async getHistoricalData(e) {
    const { symbol: t, period1: s, period2: n, interval: r = "1d" } = e;
    try {
      const i = await O.chart(t, {
        period1: s,
        period2: n,
        interval: r
      });
      return {
        success: !0,
        symbol: t,
        data: i.quotes,
        meta: i.meta
      };
    } catch (i) {
      return {
        success: !1,
        error: i.message || "Failed to fetch historical data"
      };
    }
  }
  /**
   * Get quote summary for a symbol
   */
  async getQuote(e) {
    const { symbol: t, modules: s = ["price", "summaryDetail", "defaultKeyStatistics", "financialData"] } = e;
    try {
      const n = await O.quoteSummary(t, {
        modules: s
      });
      return {
        success: !0,
        symbol: t,
        data: n
      };
    } catch (n) {
      return {
        success: !1,
        error: n.message || "Failed to fetch quote"
      };
    }
  }
  /**
   * Search for stocks by query
   */
  async search(e) {
    try {
      const t = await O.search(e);
      return {
        success: !0,
        query: e,
        results: t.quotes
      };
    } catch (t) {
      return {
        success: !1,
        error: t.message || "Failed to search"
      };
    }
  }
  /**
   * Get options data for a symbol
   */
  async getOptions(e, t) {
    try {
      const s = await O.options(e, t ? { date: t } : {});
      return {
        success: !0,
        symbol: e,
        data: s
      };
    } catch (s) {
      return {
        success: !1,
        error: s.message || "Failed to fetch options"
      };
    }
  }
  /**
   * Get trending stocks
   */
  async getTrending(e = "US") {
    try {
      const t = await O.trendingSymbols(e);
      return {
        success: !0,
        region: e,
        data: t
      };
    } catch (t) {
      return {
        success: !1,
        error: t.message || "Failed to fetch trending"
      };
    }
  }
  /**
   * Get recommendations for a symbol
   */
  async getRecommendations(e) {
    try {
      const t = await O.quoteSummary(e, {
        modules: ["recommendationTrend", "upgradeDowngradeHistory"]
      });
      return {
        success: !0,
        symbol: e,
        data: t
      };
    } catch (t) {
      return {
        success: !1,
        error: t.message || "Failed to fetch recommendations"
      };
    }
  }
  /**
   * Get financial statements for a symbol
   */
  async getFinancials(e) {
    try {
      const t = await O.quoteSummary(e, {
        modules: ["incomeStatementHistory", "balanceSheetHistory", "cashflowStatementHistory", "earnings"]
      });
      return {
        success: !0,
        symbol: e,
        data: t
      };
    } catch (t) {
      return {
        success: !1,
        error: t.message || "Failed to fetch financials"
      };
    }
  }
}
const tn = new Ca();
export {
  ls as APP_EMAIL,
  is as APP_NAME,
  jt as AlpacaMCPClient,
  Rt as BearResearcher,
  It as BullResearcher,
  X as CompanyAndAccessionNumberClass,
  en as Downloader,
  B as FinancialSituationMemory,
  $t as InvestmentJudge,
  cs as LAST_REVISED_DATE,
  Mt as MarketAnalyst,
  Z as RequestedFilingsClass,
  Kt as StockAgentsAPI,
  Wt as TOP_STOCKS,
  Ot as Trader,
  As as TradingAgentsGraph,
  At as UnifiedLLMClient,
  Ca as YFinanceWrapper,
  ee as alpacaMCPClient,
  la as analyzeCategories,
  Ls as analyzeStock,
  Cs as analyzeTopStocks,
  os as auth,
  Ge as authClient,
  Ms as backtestStock,
  Ds as chatWithAI,
  vs as cn,
  Ss as createAlpacaClient,
  ie as createLLM,
  bt as db,
  ps as demoAgents,
  ds as demoPortfolio,
  hs as demoPositions,
  ys as demoPredictionMarkets,
  ws as demoRiskMetrics,
  ms as demoSignals,
  us as demoStrategies,
  gs as demoTopTraders,
  fs as demoTrades,
  ea as fetchLeaderboard,
  qs as fetchMarketDetails,
  js as fetchMarketOrderBook,
  Qt as fetchMarkets,
  ta as fetchTopTraders,
  aa as fetchTraderPositions,
  Yt as fetchZuluTraderDetail,
  Gt as fetchZuluTraders,
  Fs as generateDebateAnalysis,
  Bs as generateDebateAnalysisWithOpenAI,
  Ps as getAccount,
  Js as getCategories,
  _s as getFundamentals,
  Pt as getIndicators,
  Vs as getLeaders,
  Xs as getMarketDebate,
  Zs as getMarketPositions,
  Gs as getMarkets,
  Ys as getMarketsByCategory,
  bs as getNews,
  Ns as getQuote,
  Is as getServiceHealth,
  St as getStockData,
  Hs as getTraderPositions,
  Es as getZuluTopByRank,
  Os as getZuluTraderById,
  $s as getZuluTraders,
  le as myLeadersAPI,
  Ts as placeOrder,
  Rs as queryKeys,
  oa as saveCategories,
  Ks as saveDebateAnalysis,
  na as saveLeaderboardData,
  sa as saveLeaders,
  Ws as saveMarketPositions,
  ia as saveMarkets,
  ra as savePositions,
  Zt as saveZuluCurrencyStats,
  fe as saveZuluTraders,
  xs as searchZuluTraders,
  ks as setStateInURL,
  ns as signIn,
  rs as signOut,
  j as stockAgentsAPI,
  Qs as syncAll,
  da as syncLeaderboard,
  ua as syncLeadersAndCategories,
  ca as syncMarkets,
  Us as syncZuluTraderDetails,
  zs as syncZuluTraders,
  ss as useSession,
  tn as yfinance
};
