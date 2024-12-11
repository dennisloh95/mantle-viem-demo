"use client";

import { useContext, useState } from "react";
import { StateProviderContext } from "../provider/StateProvider";
import { Button } from "../ui/button";
import {
  extractTransactionDepositedLogs,
  getL2TransactionHashes,
  opaqueDataToDepositData,
  walletActionsL1,
  walletActionsL2,
  getSourceHash,
  serializeTransaction,
  publicActionsL1,
  waitToProve,
} from "mantle-viem-test";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { Chain, createPublicClient, http, keccak256, parseUnits } from "viem";
import { supportedChains } from "@/config/chains";
import { mantleSepoliaTestnet } from "mantle-viem-test/chains";
import { sepolia } from "viem/chains";

const BridgeActionBtn = () => {
  const {
    isWithdraw,
    selectedToken,
    bridgeInputAmount,
    selectedChainId,
    selectedTokenPair,
    publicClient,
  } = useContext(StateProviderContext);
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const { chains, switchChainAsync } = useSwitchChain();
  const { chain } = useAccount();

  const handleBridge = async () => {
    if (chain?.id !== selectedChainId.from) {
      try {
        setIsLoading(true);
        await switchChainAsync({ chainId: selectedChainId.from });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (
      walletClient &&
      selectedToken &&
      selectedTokenPair &&
      bridgeInputAmount
    ) {
      if (isWithdraw) {
        try {
          setIsLoading(true);
          let hash;
          if (selectedToken?.symbol === "MNT") {
            hash = await walletClient
              .extend(walletActionsL2())
              .initiateMNTWithdrawal({
                request: {
                  amount: parseUnits(bridgeInputAmount, selectedToken.decimals),
                },
              });
          } else if (selectedToken?.symbol === "ETH") {
            hash = await walletClient
              .extend(walletActionsL2())
              .initiateETHWithdrawal({
                request: {
                  amount: parseUnits(bridgeInputAmount, selectedToken.decimals),
                },
              });
          } else {
            hash = await walletClient
              .extend(walletActionsL2())
              .initiateERC20Withdrawal({
                request: {
                  l2Token: selectedToken.address,
                  amount: parseUnits(
                    bridgeInputAmount,
                    selectedToken!.decimals
                  ),
                },
              });
          }

          if (hash) {
            console.log({ hash });
            const receipt = await publicClient[
              selectedChainId.from
            ].waitForTransactionReceipt({ hash });
            console.log({ receipt });

            const nextTime = await publicClient[selectedChainId.to]
              .extend(publicActionsL1())
              .getTimeToNextL2Output({
                l2BlockNumber: receipt.blockNumber,
                targetChain: publicClient[selectedChainId.from].chain as any,
                chain: publicClient[selectedChainId.to].chain,
              });

            console.log({ nextTime });

            // const { output, withdrawal } = await publicClient[
            //   selectedChainId.to
            // ]
            //   .extend(publicActionsL1())
            //   .waitToProve({
            //     receipt,
            //     targetChain: publicClient[selectedChainId.from].chain as any,
            //     chain: publicClient[selectedChainId.to].chain,
            //   });

            // console.log({ output, withdrawal });
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          setIsLoading(true);
          let hash;
          if (selectedToken?.symbol === "MNT") {
            hash = await walletClient.extend(walletActionsL1()).depositMNT({
              request: {
                amount: parseUnits(bridgeInputAmount, selectedToken.decimals),
              },
              targetChain: supportedChains[selectedChainId.to] as any,
            });
          } else if (selectedToken?.symbol === "ETH") {
            hash = await walletClient.extend(walletActionsL1()).depositETH({
              request: {
                amount: parseUnits(bridgeInputAmount, selectedToken.decimals),
              },
              targetChain: supportedChains[selectedChainId.to] as any,
            });
          } else {
            hash = await walletClient.extend(walletActionsL1()).depositERC20({
              request: {
                l1Token: selectedToken.address,
                l2Token: selectedTokenPair?.address,
                amount: parseUnits(bridgeInputAmount, selectedToken!.decimals),
              },
              targetChain: supportedChains[selectedChainId.to] as any,
            });
          }

          if (hash) {
            console.log({ hash });
            const receipt = await publicClient[
              selectedChainId.from
            ].waitForTransactionReceipt({ hash });
            console.log({ receipt });

            const [l2Hash] = getL2TransactionHashes(receipt);
            console.log({ l2Hash });

            const l2Receipt = await publicClient[
              selectedChainId.to
            ].waitForTransactionReceipt({
              hash: l2Hash,
            });

            console.log({ l2Receipt });
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <Button onClick={handleBridge} className="w-full" disabled={isLoading}>
      {chain?.id !== selectedChainId.from
        ? "Change Network"
        : isWithdraw
        ? "Withdraw"
        : "Deposit"}
    </Button>
  );
};

export default BridgeActionBtn;
