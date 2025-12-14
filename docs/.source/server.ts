// @ts-nocheck
import { default as __fd_glob_9 } from "../content/docs/meta.json?collection=docs"
import * as __fd_glob_8 from "../content/docs/trading-strategies.md?collection=docs"
import * as __fd_glob_7 from "../content/docs/technical-indicators.md?collection=docs"
import * as __fd_glob_6 from "../content/docs/investment-dictionary.md?collection=docs"
import * as __fd_glob_5 from "../content/docs/index.md?collection=docs"
import * as __fd_glob_4 from "../content/docs/brokers.md?collection=docs"
import * as __fd_glob_3 from "../content/docs/GROQ_DEBATE_SETUP.md?collection=docs"
import * as __fd_glob_2 from "../content/docs/Feature Engineering.md?collection=docs"
import * as __fd_glob_1 from "../content/docs/DASHBOARD_API_README.md?collection=docs"
import * as __fd_glob_0 from "../content/docs/API_DATA_SUMMARY.md?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_9, }, {"API_DATA_SUMMARY.md": __fd_glob_0, "DASHBOARD_API_README.md": __fd_glob_1, "Feature Engineering.md": __fd_glob_2, "GROQ_DEBATE_SETUP.md": __fd_glob_3, "brokers.md": __fd_glob_4, "index.md": __fd_glob_5, "investment-dictionary.md": __fd_glob_6, "technical-indicators.md": __fd_glob_7, "trading-strategies.md": __fd_glob_8, });