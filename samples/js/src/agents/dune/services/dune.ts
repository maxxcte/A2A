import axios from "axios";

function getApiKey(): string {
  const apiKey = process.env.DUNE_API_KEY;
  if (!apiKey) throw new Error("Missing DUNE_API_KEY");
  return apiKey;
}

// Global API key handling
const duneClient = axios.create({
  baseURL: "https://api.dune.com/api",
  headers: {
    "X-Dune-API-Key": getApiKey(),
  },
});

export { duneClient };