import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

export interface Token {
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions: {
    optimismBridgeAddress?: Address;
    thirdparty?: {
      name: string;
      url: string;
    };
    external?: {
      name: string;
      url: string;
    };
  };
  tickers?: {
    coingecko?: string;
  };
}

export interface TokenList {
  name: string;
  logoURI: string;
  keywords: Array<string>;
  tokens: Array<Token>;
  timestamp: string;
}

const mantleTokenListUrl =
  "https://token-list.mantle.xyz/mantle.tokenlist.json";

const useTokens = () => {
  return useQuery({
    queryKey: ["tokens", { mantleTokenListUrl }],
    queryFn: async () => {
      const response = await fetch(mantleTokenListUrl);
      const data: TokenList = await response.json();

      return data.tokens;
    },
    placeholderData: (prev) => prev,
    staleTime: 600000,
  });
};

export default useTokens;
