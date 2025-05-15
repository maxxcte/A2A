import axios from "axios";

const duneClient = axios.create({
  baseURL: "https://api.dune.com/api",
  headers: {
    "X-Dune-API-Key": process.env.DUNE_API_KEY,
  },
});


const BASE_PATH = "/echo/beta/balances/svm/";

// Token balance response format
interface TokenBalance {
  amount: string;
  price_usd: number;
  symbol: string;
  name: string;
}

// Fetch Solana Virtual Machine token balances
export async function fetchSVMTokenBalance(
  address: string
): Promise<TokenBalance[]> {
  const response = await duneClient.get(`${BASE_PATH}${address}`, {
    params: {
      chains: "solana",
    },
  });

  return response.data.balances.map((balance) => ({
    raw_amount: balance.amount,
    amount: Number(balance.amount) / 10 ** Number(balance.decimals),
    price_usd: balance.price_usd,
    value_usd: balance.value_usd,
    symbol: balance.symbol,
    name: balance.name,
  }));
}
