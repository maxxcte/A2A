import axios from "axios";

const duneClient = axios.create({
  baseURL: "https://api.dune.com/api",
  headers: {
    "X-Dune-API-Key": process.env.DUNE_API_KEY,
  },
});


interface DexMetrics {
  token_pair: string;
  projects: string[];
  all_time_volume: number;
  usd_liquidity: number;
  seven_day_volume_liquidity_ratio: number;
}

// Fetch DEX metrics for a specific token pair
export async function fetchDexMetrics(
  chain: string,
  token_pair: string
): Promise<DexMetrics[]> {
  const response = await duneClient.get(`/v1/dex/pairs/${chain}`, {
    params: {
      token_pair,
      columns:
        "token_pair,projects,all_time_volume,usd_liquidity,seven_day_volume_liquidity_ratio",
    },
  });
  return response.data.result.rows;
}

// Fetch top token pairs by chain, sorted by liquidity
export async function fetchTopTokenPairByChain(
  chain: string
): Promise<DexMetrics[]> {
  const response = await duneClient.get(`/v1/dex/pairs/${chain}`, {
    params: {
      columns:
        "token_pair,projects,all_time_volume,usd_liquidity,seven_day_volume_liquidity_ratio",
      sort_by: "usd_liquidity desc",
      limit: 100,
    },
  });
  return response.data.result.rows;
}
