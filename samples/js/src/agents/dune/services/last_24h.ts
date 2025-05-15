import axios from "axios";

const duneClient = axios.create({
  baseURL: "https://api.dune.com/api",
  headers: {
    "X-Dune-API-Key": process.env.DUNE_API_KEY,
  },
});


// Map queryId → label name
const queryMap: Record<number, string> = {
  5001416: "LaunchLab Tokens",
  5126341: "LetsBonk Tokens",
  4006260: "Pumpfun Tokens",
  5073803: "Boop Tokens",
};

interface QueryResult {
  label: string;
  queryId: number;
  rows: any[];
}

export async function fetchDuneQueryResult(
  queryId: number,
  limit = 1
): Promise<QueryResult> {
  const label = queryMap[queryId] || `Query ${queryId}`;

  try {
    const response = await duneClient.get(`/v1/query/${queryId}/results`, {
      params: { limit },
    });

    return {
      label,
      queryId,
      rows: response.data.result?.rows ?? [],
    };
  } catch (error) {
    console.error(
      `❌ Failed to fetch ${label} (ID ${queryId}):`,
      error?.response?.data || error.message
    );
    return {
      label,
      queryId,
      rows: [],
    };
  }
}

export async function fetchTokens24h(limit = 1): Promise<QueryResult[]> {
  const queryIds = [5001416, 5126341, 4006260, 5073803];

  return await Promise.all(
    queryIds.map((queryId) => fetchDuneQueryResult(queryId, limit))
  );
}
