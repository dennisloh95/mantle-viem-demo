"use client";

import { StateProviderContext } from "@/components/provider/StateProvider";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/hono";
import { checkIsTestnet } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getWithdrawals,
  publicActionsL1,
  publicActionsL2,
  walletActionsL1,
} from "mantle-viem-test";
import { mantleSepoliaTestnet } from "mantle-viem-test/chains";
import { useContext, useEffect, useState } from "react";
import { createPublicClient, Hash, Hex, http } from "viem";
import { sepolia } from "viem/chains";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

const emptyHash =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(`/api/rpc/${sepolia.id}`),
}).extend(publicActionsL1());

const mantleSepoliaClient = createPublicClient({
  chain: mantleSepoliaTestnet,
  transport: http(`/api/rpc/${mantleSepoliaTestnet.id}`),
}).extend(publicActionsL2());

const HistoryPage = () => {
  const { chain, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { chains, switchChainAsync } = useSwitchChain();

  const {
    isWithdraw,
    selectedToken,
    bridgeInputAmount,
    selectedChainId,
    selectedTokenPair,
    publicClient,
  } = useContext(StateProviderContext);

  const { data: withdrawals } = useQuery({
    enabled: !!(address && chain),
    queryKey: ["withdrawal", { chain: chain?.id, address }],
    queryFn: async () => {
      const response = await client.api.withdrawal.$get({
        query: {
          address: address!,
          testnet: checkIsTestnet(chain!.id) ? "true" : "false",
          page: "1",
          pageSize: "50",
        },
      });

      if (response.ok) {
        const data = await response.json();

        return data;
      }
      throw new Error("Failed to fetch withdrawals");
    },
    staleTime: 5000,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChainCheck = async () => {
    if (chain?.id !== 11155111) {
      await switchChainAsync({ chainId: 11155111 });

      return;
    }
  };

  const handleProve = async (withdrawHash: string) => {
    if (!walletClient) return;
    await handleChainCheck();

    try {
      setIsLoading(true);

      const receipt = await mantleSepoliaClient.getTransactionReceipt({
        hash: withdrawHash as Hash,
      });

      const [withdrawal] = getWithdrawals(receipt);
      const output = await sepoliaClient.getL2Output({
        l2BlockNumber: receipt.blockNumber,
        targetChain: mantleSepoliaClient.chain,
      });

      const args = await mantleSepoliaClient.buildProveWithdrawal({
        account: address!,
        output,
        withdrawal,
      });

      const gas = await sepoliaClient.estimateProveWithdrawalGas(args);

      console.log({ gas });

      const hash = await walletClient
        .extend(walletActionsL1())
        .proveWithdrawal({
          gas,
          ...args,
        });

      console.log({ hash });

      const proveReceipt = await sepoliaClient.waitForTransactionReceipt({
        hash,
      });

      console.log({ proveReceipt });

      const timeToFinalize = await sepoliaClient.getTimeToFinalize({
        withdrawalHash: withdrawal.withdrawalHash,
        targetChain: mantleSepoliaClient.chain,
      });

      console.log({ timeToFinalize });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = async (withdrawHash: string) => {
    if (!walletClient) return;
    await handleChainCheck();

    try {
      setIsLoading(true);

      const receipt = await mantleSepoliaClient.getTransactionReceipt({
        hash: withdrawHash as Hash,
      });

      const [withdrawal] = getWithdrawals(receipt);

      console.log({ withdrawal });

      const gas = await sepoliaClient.estimateFinalizeWithdrawalGas({
        withdrawal,
        account: address!,
        targetChain: mantleSepoliaClient.chain,
      });

      console.log({ gas });

      const hash = await walletClient
        .extend(walletActionsL1())
        .finalizeWithdrawal({
          targetChain: mantleSepoliaClient.chain,
          withdrawal,
          gas,
        });

      console.log({ hash });

      const finalizeReceipt = await sepoliaClient.waitForTransactionReceipt({
        hash,
      });

      console.log({ finalizeReceipt });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckFinalizeTime = async (withdrawHash: string) => {
    if (!walletClient) return;

    try {
      setIsLoading(true);

      const receipt = await mantleSepoliaClient.getTransactionReceipt({
        hash: withdrawHash as Hash,
      });

      const [withdrawal] = getWithdrawals(receipt);

      const timeToFinalize = await sepoliaClient.getTimeToFinalize({
        withdrawalHash: withdrawal.withdrawalHash,
        targetChain: mantleSepoliaClient.chain,
      });

      console.log({ timeToFinalize });

      if (timeToFinalize.seconds === 0) {
        await handleFinalize(withdrawHash);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckProveTime = async (withdrawHash: string) => {
    if (!walletClient) return;

    try {
      setIsLoading(true);

      const receipt = await mantleSepoliaClient.getTransactionReceipt({
        hash: withdrawHash as Hash,
      });

      const timeToProve = await sepoliaClient.getTimeToNextL2Output({
        l2BlockNumber: receipt.blockNumber,
        targetChain: mantleSepoliaClient.chain,
      });

      console.log({ timeToProve });

      if (timeToProve.seconds === 0) {
        await handleProve(withdrawHash);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      HistoryPage
      <div className="space-y-2">
        {withdrawals?.Records.map((w) => (
          <div key={w.guid} className="border border-white p-2">
            <div className="flex justify-between">
              <div>l2 withdraw hash: {w.l2TransactionHash}</div>
              <div>
                {w.status === 0 && (
                  <Button
                    disabled={isLoading}
                    onClick={() => handleCheckProveTime(w.l2TransactionHash)}
                  >
                    check time to prove
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                l1 prove hash:{" "}
                {w.l1ProveTxHash !== emptyHash && w.l1ProveTxHash}
              </div>
              <div>
                {w.status === 2 && (
                  <Button
                    disabled={isLoading}
                    onClick={() => handleCheckFinalizeTime(w.l2TransactionHash)}
                  >
                    check time to finalize
                  </Button>
                )}
              </div>
              <div>
                {w.status === 1 && (
                  <Button
                    disabled={isLoading}
                    onClick={() => handleProve(w.l2TransactionHash)}
                  >
                    {chain?.id !== 11155111 ? "Change network" : "Prove"}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                l1 finalize hash:{" "}
                {w.l1FinalizeTxHash !== emptyHash && w.l1FinalizeTxHash}
              </div>
              <div>
                {w.status === 3 && (
                  <Button
                    disabled={isLoading}
                    onClick={() => handleFinalize(w.l2TransactionHash)}
                  >
                    {chain?.id !== 11155111 ? "Change network" : "Finalize"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
