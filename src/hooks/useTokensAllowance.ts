import { useQuery } from "@tanstack/react-query";
import { erc20Abi, zeroAddress } from "viem";
import { type Address, formatUnits } from "viem";
import { useAccount } from "wagmi";
import { Token } from "./useTokens";
import { useContext } from "react";
import { StateProviderContext } from "@/components/provider/StateProvider";

type Props = {
  tokens?: Token[];
  spender?: Address;
  chainId?: number;
};

const useTokensAllowance = ({ tokens, spender, chainId }: Props) => {
  const { publicClient } = useContext(StateProviderContext);
  const { address } = useAccount();

  const tokenAddresses = tokens?.map((token) => token.address) || [];

  return useQuery({
    enabled: !!(tokens && spender && chainId),
    queryKey: [
      "tokens-allowance",
      { address, spender, tokenAddresses: tokenAddresses.join(",") },
    ],
    queryFn: async () => {
      const res = await publicClient[chainId!].multicall({
        contracts: tokenAddresses.map((addr) => ({
          address: addr,
          functionName: "allowance",
          abi: erc20Abi,
          args: [address, spender],
        })),
      });

      const allowance: Record<string, string> = {};

      if (tokens) {
        res.map((balance, i) => {
          if (balance.status === "success") {
            const token = tokens[i];
            allowance[token.address] = formatUnits(
              BigInt(balance.result),
              token.decimals
            );
          }
        });
      }

      return allowance;
    },
    staleTime: 10000,
  });
};

export default useTokensAllowance;
