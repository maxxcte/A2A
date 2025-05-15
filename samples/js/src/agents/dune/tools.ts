import { ai, z } from "./genkit.js";
import { fetchActiveAddress } from "./services/active_address.js";
import { duneClient } from "./services/dune.js";
import { fetchGraduates } from "./services/graduates.js";
import {
  fetchDexMetrics,
  fetchTopTokenPairByChain,
  fetchSVMTokenBalance,
} from "./services/index.js";
import { fetchTokens24h } from "./services/last_24h.js";

// --- DEX: Get metrics for a token pair ---
export const getDexPairMetrics = ai.defineTool(
  {
    name: "get_dex_pair_metrics",
    description:
      "Given a blockchain, retrieves essential metadata and statistical data for a given token pair",
    inputSchema: z.object({
      chain: z
        .string()
        .describe("The blockchain to query (e.g., solana, ethereum)"),
      token_pair: z.string().describe("Token pair identifier (e.g., USDC/SOL)"),
    }),
  },
  async ({ chain, token_pair }) => {
    const metrics = await fetchDexMetrics(chain, token_pair);
    return { metrics };
  }
);

// --- DEX: Get top token pairs by USD liquidity ---
export const getTokenPairsLiquidity = ai.defineTool(
  {
    name: "get_token_pairs_liquidity",
    description:
      "Identify token pairs with the highest USD liquidity on a given chain",
    inputSchema: z.object({
      chain: z
        .string()
        .describe("The blockchain to query (e.g., solana, ethereum)"),
    }),
  },
  async ({ chain }) => {
    const metrics = await fetchTopTokenPairByChain(chain);
    return { metrics };
  }
);

// --- SVM: Get token balances for a wallet ---
export const getSvmTokenBalances = ai.defineTool(
  {
    name: "get_svm_token_balances",
    description: "Get token balances for a Solana wallet address",
    inputSchema: z.object({
      wallet_address: z.string().describe("The Solana wallet address (base58)"),
    }),
  },
  async ({ wallet_address }) => {
    const metrics = await fetchSVMTokenBalance(wallet_address);
    return { metrics };
  }
);

// --- Get Graduates from the last 24 hours ---
export const getGraduates = ai.defineTool(
  {
    name: "get_graduates",
    description:
      "Return a breakdown of tokens launched (graduated) on Solana in the last 24 hours, grouped by launch platform such as LaunchLab, LetsBonk, Pumpfun, and Boop. Each entry represents tokens that were successfully created and deployed via these launchpads.",
    inputSchema: z.object({}),
  },
  async () => {
    const graduates = await fetchGraduates();
    return { graduates };
  }
);

// --- Get total tokens created on Solana in the last 24 hours ---
export const getTotalTokensCreatedByPlatform = ai.defineTool(
  {
    name: "get_total_tokens_created_by_platform",
    description:
      "Return the total number of tokens created on Solana in the last 24 hours, along with a breakdown by platform. This includes all tokens launched via platforms such as LaunchLab, Pumpfun, LetsBonk, and Boop.",
    inputSchema: z.object({}),
  },
  async () => {
    const tokenResults = await fetchTokens24h(1);

    const breakdown = tokenResults.map(({ label, rows }) => {
      return { platform: label, data: rows?.[0] };
    });

    return {
      breakdown,
    };
  }
);

export const getActiveAddressesByPlatform = ai.defineTool(
  {
    name: "get_active_addresses",
    description:
      "Return the number of active addresses on Solana in the last 24 hours, grouped by platform. Includes LaunchLab, Pumpfun, LetsBonk, Boop, and others if available.",
    inputSchema: z.object({}),
  },
  async () => {
    const addressResults = await fetchActiveAddress(1);

    const breakdown = addressResults.map(({ label, rows }) => {
      return { platform: label, data: rows?.[0] };
    });

    return {
      breakdown,
    };
  }
);

export const getTopTokensLaunched = ai.defineTool(
  {
    name: "get_top_tokens_launched",
    description:
      "Return a list of the top tokens on Solana based on recent launches. Defaults to tokens launched in the last 24 hours, but can also return tokens from the last 7 days. Use this to explore trending or newly created tokens.",
    inputSchema: z.object({
      timeframe: z
        .enum(["24h", "7d"])
        .default("24h")
        .describe("Time window to filter tokens: '24h' or '7d'")
        .optional(),
    }),
  },
  async ({ timeframe = "24h" }) => {
    const queryId = timeframe === "24h" ? 5137851 : 5138002;

    const response = await duneClient.get(`/v1/query/${queryId}/results`, {
      params: { limit: 10 },
    });

    const rows = response.data.result?.rows ?? [];

    return {
      timeframe,
      top_tokens: rows,
    };
  }
);
