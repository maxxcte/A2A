import axios from "axios";

const duneClient = axios.create({
  baseURL: "https://api.dune.com/api",
  headers: {
    "X-Dune-API-Key": process.env.DUNE_API_KEY,
  },
});

const queryMap = {
  LaunchLab: 5126416,
  LetsBonk: 5126361,
  Pumpfun: 5041379,
  Boop: 5073810,
};

const labelMap: Record<string, string> = {
  LaunchLab: "LaunchLab Graduates",
  LetsBonk: "LetsBonk Graduates",
  Pumpfun: "Pumpfun Graduates",
  Boop: "Boop Graduates",
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

export async function fetchGraduates(limit = 1): Promise<QueryResult[]> {
  const entries = Object.entries(queryMap);
  return await Promise.all(
    entries.map(([label, queryId]) =>
      fetchDuneQueryResult(label, queryId, limit)
    )
  );
}
