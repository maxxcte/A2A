import axios from "axios";

const duneClient = axios.create({
  baseURL: "https://api.dune.com/api",
  headers: {
    "X-Dune-API-Key": process.env.DUNE_API_KEY,
  },
});


const queryMap = {
  LaunchLab: 5002608,
  LetsBonk: 5126485,
  Pumpfun: 4007266,
  Boop: 5073823,
};

const labelMap: Record<string, string> = {
  LaunchLab: "LaunchLab",
  LetsBonk: "LetsBonk",
  Pumpfun: "Pumpfun",
  Boop: "Boop",
};

interface QueryResult {
  label: string;
  queryId: number;
  rows: any[];
}

export async function fetchDuneQueryResult(
  label: string,
  queryId: number,
  limit = 1
): Promise<QueryResult> {
  const customLabel = labelMap[label] || label;

  try {
    const response = await duneClient.get(`/v1/query/${queryId}/results`, {
      params: { limit },
    });

    return {
      label: customLabel,
      queryId,
      rows: response.data.result?.rows ?? [],
    };
  } catch (error) {
    console.error(
      `❌ Failed to fetch ${customLabel} (ID ${queryId}):`,
      error?.response?.data || error.message
    );
    return {
      label: customLabel,
      queryId,
      rows: [],
    };
  }
}

export async function fetchActiveAddress(limit = 1): Promise<QueryResult[]> {
  const entries = Object.entries(queryMap);
  return await Promise.all(
    entries.map(([label, queryId]) =>
      fetchDuneQueryResult(label, queryId, limit)
    )
  );
}
