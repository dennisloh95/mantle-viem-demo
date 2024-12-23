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
  publicActionsL2,
} from "mantle-viem-test";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import {
  Chain,
  createPublicClient,
  http,
  isAddress,
  keccak256,
  parseUnits,
} from "viem";
import { supportedChains } from "@/config/chains";
import { mantleSepoliaTestnet } from "mantle-viem-test/chains";
import { sepolia } from "viem/chains";

const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(`/api/rpc/${sepolia.id}`),
}).extend(publicActionsL1());

const mantleSepoliaClient = createPublicClient({
  chain: mantleSepoliaTestnet,
  transport: http(`/api/rpc/${mantleSepoliaTestnet.id}`),
}).extend(publicActionsL2());

const BridgeActionBtn = () => {
  const {
    isWithdraw,
    selectedToken,
    bridgeInputAmount,
    selectedChainId,
    selectedTokenPair,
    publicClient,
    recipient,
  } = useContext(StateProviderContext);
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const { chains, switchChainAsync } = useSwitchChain();
  const { chain, address } = useAccount();

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
        let request = {
          amount: parseUnits(bridgeInputAmount, selectedToken.decimals),
          to: isAddress(recipient) ? recipient : undefined,
        };

        try {
          setIsLoading(true);
          let hash;
          if (selectedToken?.symbol === "MNT") {
            const gas =
              await mantleSepoliaClient.estimateInitiateMNTWithdrawalGas({
                request,
                account: address!,
              });

            console.log({ gas });

            hash = await walletClient
              .extend(walletActionsL2())
              .initiateMNTWithdrawal({
                request,
                gas,
              });
          } else if (selectedToken?.symbol === "ETH") {
            const gas =
              await mantleSepoliaClient.estimateInitiateETHWithdrawalGas({
                request,
                account: address!,
              });

            console.log({ gas });

            hash = await walletClient
              .extend(walletActionsL2())
              .initiateETHWithdrawal({
                request,
                gas,
              });
          } else {
            // @ts-ignore
            request.l2Token = selectedToken.address;

            const gas =
              await mantleSepoliaClient.estimateInitiateERC20Withdrawal({
                // @ts-ignore
                request,
                account: address!,
              });

            console.log({ gas });

            hash = await walletClient
              .extend(walletActionsL2())
              .initiateERC20Withdrawal({
                // @ts-ignore
                request,
                gas,
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

          let request = {
            amount: parseUnits(bridgeInputAmount, selectedToken.decimals),
            to: isAddress(recipient) ? recipient : undefined,
          };

          if (selectedToken?.symbol === "MNT") {
            const gas = await sepoliaClient.estimateDepositMNTGas({
              request,
              targetChain: supportedChains[selectedChainId.to] as any,
              account: address!,
            });

            console.log({ gas });

            hash = await walletClient.extend(walletActionsL1()).depositMNT({
              request,
              targetChain: supportedChains[selectedChainId.to] as any,
              gas,
            });
          } else if (selectedToken?.symbol === "ETH") {
            const gas = await sepoliaClient.estimateDepositETHGas({
              request,
              targetChain: supportedChains[selectedChainId.to] as any,
              account: address!,
            });

            console.log({ gas });

            hash = await walletClient.extend(walletActionsL1()).depositETH({
              request,
              targetChain: supportedChains[selectedChainId.to] as any,
              gas,
            });
          } else {
            // @ts-ignore
            request.l1Token = selectedToken.address;
            // @ts-ignore
            request.l2Token = selectedTokenPair?.address;

            const gas = await sepoliaClient.estimateDepositERC20Gas({
              // @ts-ignore
              request,
              targetChain: supportedChains[selectedChainId.to] as any,
              account: address!,
            });

            console.log({ gas });

            hash = await walletClient.extend(walletActionsL1()).depositERC20({
              // @ts-ignore
              request,
              targetChain: supportedChains[selectedChainId.to] as any,
              gas,
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
