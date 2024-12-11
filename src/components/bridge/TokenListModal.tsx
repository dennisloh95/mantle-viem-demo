import React, { useContext, useMemo, useState } from "react";
import { StateProviderContext } from "../provider/StateProvider";
import ResponsiveDialog from "../ResponsiveDialog";
import Image from "next/image";
import { LucideChevronDown } from "lucide-react";
import useTokensBalance from "@/hooks/useTokensBalance";
import { Token } from "@/hooks/useTokens";
import { Button } from "../ui/button";

const TokenListModal = () => {
  const [searchText, setSearchText] = useState("");
  const {
    setSelectedToken,
    selectedToken,
    tokenList,
    selectedBridgeOption,
    selectedChainId,
    setBridgeInputAmount,
  } = useContext(StateProviderContext);

  const { data: balances } = useTokensBalance({
    chainId: selectedChainId.from,
    tokens: tokenList.from,
  });

  const defaultTokenSymbol = [
    "MNT",
    "ETH",
    "mETH",
    "cmETH",
    "COOK",
    "USDC",
    "USDT",
    "USDe",
    "sUSDe",
  ];
  const defaultTokenList = useMemo(() => {
    const tokenListFilter = tokenList.from
      ? tokenList.from.filter((token) => {
          return (
            defaultTokenSymbol.indexOf(token.symbol) >= 0 &&
            token.chainId === selectedChainId.from
          );
        })
      : [];

    const sortToken = tokenListFilter.sort((a, b) => {
      const priorityA = defaultTokenSymbol.indexOf(a.symbol);
      const priorityB = defaultTokenSymbol.indexOf(b.symbol);
      // If both are in the priority list, sort by their priority
      if (priorityA !== -1 && priorityB !== -1) {
        return priorityA - priorityB;
      }

      // If one is in the priority list, it comes first
      if (priorityA !== -1) return -1;
      if (priorityB !== -1) return 1;

      // If neither is in the priority list, sort alphabetically by symbol
      return a.symbol.localeCompare(b.symbol);
    });

    return sortToken;
  }, [tokenList, selectedChainId]);

  const filterTokenList = useMemo(() => {
    if (searchText === "" || searchText === undefined || searchText === null) {
      return tokenList.from;
    }
    const regex = new RegExp(searchText, "i");
    return tokenList.from
      ? tokenList.from.filter((token) => {
          return regex.test(token.name) || regex.test(token.symbol);
        })
      : [];
  }, [searchText, tokenList]);

  const handleSelectToken = (token: Token) => {
    setBridgeInputAmount("");
    setSelectedToken(token);
  };

  return (
    <ResponsiveDialog
      triggerClass="p-0 border-0 shadow-none h-full px-2 hover:bg-transparent"
      trigger={
        <button className="flex size-full min-w-[120px] items-center justify-between max-md:hidden">
          <div className="flex items-center gap-x-2 font-medium">
            <Image
              src={selectedToken?.logoURI!}
              alt={selectedToken?.symbol!}
              width={20}
              height={20}
              className="size-[20px] overflow-hidden rounded-full"
            />

            {selectedToken?.symbol}
          </div>
          <LucideChevronDown className="size-4 opacity-50" />
        </button>
      }
      content={(close) => (
        <div className="flex flex-col p-0  h-auto max-h-[96dvh] md:max-h-[80vh]">
          <div className="flex items-center justify-between px-4 pb-0 pt-8">
            <h1 className="text-base font-bold">Select a token</h1>
          </div>
          <div className="flex flex-col gap-4 border-b border-zinc-100 p-4 dark:border-zinc-900">
            <input
              defaultValue={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              placeholder="Search"
              className="block w-full rounded-lg border-0 bg-zinc-100 px-4 py-3 pr-10 text-sm font-medium text-zinc-900 outline-none ring-inset ring-zinc-900/5 placeholder:text-zinc-400 focus:ring-2 dark:bg-white/10 dark:text-zinc-50 dark:ring-zinc-50/5 sm:leading-6"
            />
            <div className="flex flex-wrap items-center gap-3">
              {defaultTokenList.map((token: Token, idx) => {
                return (
                  <div
                    key={idx}
                    className="text-[var(--text-color-primary)] flex cursor-pointer items-center space-x-1 rounded-full border border-zinc-100 px-2 py-1 pr-3  transition hover:bg-zinc-200 dark:border-zinc-800 hover:dark:bg-zinc-800"
                    onClick={() => handleSelectToken(token)}
                  >
                    <Image
                      src={token.logoURI}
                      alt={token.symbol}
                      width={20}
                      height={20}
                      className="size-[20px] overflow-hidden rounded-full"
                    />
                    <span className="inline-flex text-sm font-medium">
                      {token.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex basis-full flex-col overflow-y-auto">
            {filterTokenList?.map((token: Token, idx) => (
              <div
                key={idx}
                className={`relative flex cursor-pointer justify-between p-4 transition hover:bg-[var(--hover-bg)] ${
                  token.address === selectedToken?.address
                    ? "bg-black/[0.025] dark:bg-white/[0.05] text-[var(--text-color-light)]"
                    : "text-[var(--text-color-primary)]"
                }`}
                onClick={() => {
                  handleSelectToken(token);
                  close();
                }}
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={token.logoURI}
                    alt={token.name}
                    width={32}
                    height={32}
                    className="size-8 overflow-hidden rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">{token.name}</span>
                    </div>
                    <span className="text-xs font-medium">{token.symbol}</span>
                  </div>
                </div>
                <div className="ml-auto flex flex-col gap-1 text-right">
                  <span className="text-sm font-medium">
                    {selectedBridgeOption === 0 &&
                      balances?.[token.address] &&
                      balances[token.address]}
                  </span>
                </div>
              </div>
            ))}
            {filterTokenList?.length === 0 && (
              <div className="pb-12 pt-8 text-center text-sm font-bold">
                <span>No results found</span>
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default TokenListModal;
