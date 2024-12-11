"use client";

import useTokensBalance from "@/hooks/useTokensBalance";
import React, { useContext, useMemo } from "react";
import ResponsiveDialog from "../ResponsiveDialog";
import SwitchBridgeTransition from "./SwitchBridgeTransition";
import { useAccount } from "wagmi";
import { LucideCheck, LucideChevronDown } from "lucide-react";
import Skeleton from "../Skeleton";
import Image from "next/image";
import { allChains, bridgeChains } from "@/config/chains";
import { checkIsTestnet, checkUpdatedEnvChain, cn } from "@/lib/utils";
import { StateProviderContext } from "../provider/StateProvider";

interface Props {
  type: "from" | "to";
  className?: string;
}

const triggerButtonStyle = `flex w-full items-center font-medium bg-card dark:bg-[#1C1E20] justify-between border text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#A8D0CD] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 rounded-lg border-[#C4C4C4] px-2 py-[12px] dark:border-[#41474D] h-auto`;

const BridgeChainCard = ({ type, className }: Props) => {
  const { address } = useAccount();
  const {
    selectedChainId,
    tokenList,
    hideOfficialBridgeItems,
    selectedToken,
    isWithdraw,
    isTestnet,
    setSelectedChainId,
    selectedTokenPair,
  } = useContext(StateProviderContext);

  const currentChainId = useMemo(() => {
    return selectedChainId[type];
  }, [type, selectedChainId]);

  const { data: tokensBalance, isFetching } = useTokensBalance({
    chainId: selectedChainId[type],
    tokens: tokenList[type],
  });

  const chainDirections = useMemo(() => {
    if (type === "from") {
      return isWithdraw ? bridgeChains.withdraw : bridgeChains.deposit;
    } else {
      return isWithdraw ? bridgeChains.deposit : bridgeChains.withdraw;
    }
  }, [type, isWithdraw]);

  const selectedTokenBalance = useMemo(() => {
    if (
      type === "from" &&
      tokensBalance &&
      selectedToken?.address &&
      tokensBalance[selectedToken.address]
    ) {
      return tokensBalance[selectedToken.address];
    }

    if (
      type === "to" &&
      tokensBalance &&
      selectedTokenPair?.address &&
      tokensBalance[selectedTokenPair?.address]
    ) {
      return tokensBalance[selectedTokenPair?.address];
    }

    return "0";
  }, [type, currentChainId, tokensBalance, selectedToken, selectedTokenPair]);

  const handleChainSwitch = (e: string) => {
    const updateToTestnet = !isTestnet && checkIsTestnet(Number(e));
    const updateToMainnet = isTestnet && !checkIsTestnet(Number(e));

    const { from, to } = selectedChainId;

    if (type === "from") {
      const toChain = () => {
        if (updateToTestnet) {
          return checkUpdatedEnvChain(true, !isWithdraw);
        } else if (updateToMainnet) {
          return checkUpdatedEnvChain(false, !isWithdraw);
        } else {
          return null;
        }
      };
      setSelectedChainId({
        from: Number(e),
        to: toChain() ?? to,
      });
    } else {
      const fromChain = () => {
        if (updateToTestnet) {
          return checkUpdatedEnvChain(true, isWithdraw);
        } else if (updateToMainnet) {
          return checkUpdatedEnvChain(false, isWithdraw);
        } else {
          return null;
        }
      };
      setSelectedChainId({
        from: fromChain() ?? from,
        to: Number(e),
      });
    }
  };

  return (
    <div
      className={cn("transition-transform ease-in-out duration-500", className)}
    >
      <ResponsiveDialog
        triggerClass={triggerButtonStyle}
        trigger={
          <div className="flex w-full flex-col space-y-1.5">
            <p className="flex w-full flex-row justify-between text-base leading-6 text-[#C4C4C4] dark:text-[#464646]">
              <span className="capitalize">{type}</span>
              <SwitchBridgeTransition
                isHidden={hideOfficialBridgeItems || !address}
              >
                <span>Balance</span>
              </SwitchBridgeTransition>
            </p>
            <div className="flex w-full flex-row items-center justify-between text-[#464646] dark:text-[#C4C4C4]">
              <div className="flex flex-row items-center">
                <div className="flex items-center justify-between">
                  <div className="relative mr-2 size-6 text-[#464646] dark:text-[#C4C4C4]">
                    <Image
                      src={allChains[currentChainId].iconUrl}
                      alt={allChains[currentChainId].name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-[#464646] dark:text-[#C4C4C4]">
                    {allChains[currentChainId].name}
                  </span>
                </div>

                <LucideChevronDown className="size-4" />
              </div>
              <SwitchBridgeTransition
                isHidden={hideOfficialBridgeItems || !address}
              >
                <Skeleton isLoaded={!isFetching}>
                  <span className="text-sm">
                    {selectedTokenBalance}
                    {selectedToken && ` ${selectedToken.symbol}`}
                  </span>
                </Skeleton>
              </SwitchBridgeTransition>
            </div>
          </div>
        }
        content={(close) => (
          <div className="flex h-auto flex-col max-h-[96dvh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 pb-0 pt-8">
              <h1 className="text-base font-bold">Chain</h1>
            </div>
            <div className="flex basis-full flex-col overflow-y-auto">
              {chainDirections.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    handleChainSwitch(item.id.toString());
                    close();
                  }}
                  className={`relative flex cursor-pointer justify-between items-center p-4 hover:bg-[var(--hover-bg)] transition-all duration-300 ${
                    currentChainId.toString() === item.id.toString()
                      ? "bg-black/[0.025] dark:bg-white/[0.05]"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="relative mr-2 size-6 text-[#464646] dark:text-[#C4C4C4]">
                      <Image
                        src={item.iconUrl}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <span className="text-[#464646] dark:text-[#C4C4C4]">
                      {item.name}
                    </span>
                  </div>

                  {currentChainId.toString() === item.id.toString() ? (
                    <LucideCheck className="size-4" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default BridgeChainCard;
