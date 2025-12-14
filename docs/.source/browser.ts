// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"API_DATA_SUMMARY.md": () => import("../content/docs/API_DATA_SUMMARY.md?collection=docs"), "DASHBOARD_API_README.md": () => import("../content/docs/DASHBOARD_API_README.md?collection=docs"), "Feature Engineering.md": () => import("../content/docs/Feature Engineering.md?collection=docs"), "GROQ_DEBATE_SETUP.md": () => import("../content/docs/GROQ_DEBATE_SETUP.md?collection=docs"), "brokers.md": () => import("../content/docs/brokers.md?collection=docs"), "index.md": () => import("../content/docs/index.md?collection=docs"), "investment-dictionary.md": () => import("../content/docs/investment-dictionary.md?collection=docs"), "technical-indicators.md": () => import("../content/docs/technical-indicators.md?collection=docs"), "trading-strategies.md": () => import("../content/docs/trading-strategies.md?collection=docs"), }),
};
export default browserCollections;