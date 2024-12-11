import { useQuery } from "@tanstack/react-query";
import { erc20Abi, zeroAddress } from "viem";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { Token } from "./useTokens";
import { useContext } from "react";
import {
  StateProps,
  StateProviderContext,
} from "@/components/provider/StateProvider";
import { isLayer1 } from "@/lib/utils";

type Props = {
  tokens?: Token[];
  chainId?: number;
};

const useTokensBalance = ({ tokens, chainId }: Props) => {
  const { publicClient } = useContext(StateProviderContext);
  const { address } = useAccount();

  const filterToken = tokens?.filter(
    (t) =>
      [
        "0x0000000000000000000000000000000000000000",
        "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      ].indexOf(t.address) === -1
  );

  const tokenAddresses = filterToken?.map((token) => token.address) || [];

  return useQuery({
    enabled: !!(tokens && chainId && address),
    queryKey: [
      "tokens-balance",
      { address, tokenAddresses: tokenAddresses.join(",") },
    ],
    queryFn: async () => {
      const res = await publicClient[chainId!].multicall({
        contracts: tokenAddresses.map((addr) => ({
          address: addr,
          functionName: "balanceOf",
          abi: erc20Abi,
          args: [address],
        })),
      });

      const balance = await publicClient[chainId!].getBalance({
        address: address!,
      });

      const balances: Record<string, string> = {};

      if (filterToken) {
        res.map((balance, i) => {
          if (balance.status === "success") {
            const token = filterToken[i];
            balances[token.address] = formatUnits(
              BigInt(balance.result),
              token.decimals
            );
          }
        });
      }

      if (chainId && isLayer1(chainId)) {
        balances[zeroAddress] = formatUnits(balance, 18);
      } else {
        balances["0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"] = formatUnits(
          balance,
          18
        );
      }

      return balances;
    },
    staleTime: 10000,
  });
};

export default useTokensBalance;
