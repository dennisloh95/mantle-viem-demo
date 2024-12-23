"use client";

import { bridgeChains, supportedChains, walletConfig } from "@/config/chains";
import useTokens, { Token } from "@/hooks/useTokens";
import { mantle, mantleSepoliaTestnet } from "mantle-viem-test/chains";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPublicClient, fallback, http, PublicClient } from "viem";
import { sepolia } from "viem/chains";
import { useWalletClient } from "wagmi";

export type StateProps = {
  publicClient: Record<number, PublicClient>;
  tokenList: {
    from: Token[] | undefined;
    to: Token[] | undefined;
  };
  selectedBridgeOption: number;
  setSelectedBridgeOption: Dispatch<SetStateAction<number>>;
  selectedChainId: {
    from: number;
    to: number;
  };
  setSelectedChainId: Dispatch<
    SetStateAction<{
      from: number;
      to: number;
    }>
  >;
  isTestnet: boolean;
  isWithdraw: boolean;
  selectedToken: Token | undefined;
  setSelectedToken: Dispatch<SetStateAction<Token | undefined>>;
  selectedTokenPair: Token | undefined;
  hideOfficialBridgeItems: boolean;
  isForceThirdParty: boolean;
  bridgeInputAmount: string;
  setBridgeInputAmount: Dispatch<SetStateAction<string>>;
  recipient: string;
  setRecipient: Dispatch<SetStateAction<string>>;
};

export const StateProviderContext = createContext<StateProps>({} as StateProps);

const StateProvider = ({ children }: { children: ReactNode }) => {
  const { data: tokens } = useTokens();

  const publicClient = useMemo(() => {
    return walletConfig.chains.reduce<Record<number, PublicClient>>(
      (acc, crr) => {
        acc[crr.id] = createPublicClient({
          chain: crr,
          transport: fallback([http(`/api/rpc/${crr.id}`), http()]),
        }) as PublicClient;
        return acc;
      },
      {}
    );
  }, []);

  const [selectedToken, setSelectedToken] = useState<Token | undefined>();
  const [selectedBridgeOption, setSelectedBridgeOption] = useState(0);
  const [bridgeInputAmount, setBridgeInputAmount] = useState("");

  const [recipient, setRecipient] = useState("");

  const [selectedChainId, setSelectedChainId] = useState({
    from: 11155111,
    to: 5003,
  });

  const [selectedTokenPair, setSelectedTokenPair] = useState<
    Token | undefined
  >();

  const isTestnet = useMemo(() => {
    return [11155111, 5003].includes(selectedChainId.from);
  }, [selectedChainId.from]);

  const isWithdraw = useMemo(() => {
    return [5000, 5003].includes(selectedChainId.from);
  }, [selectedChainId.from]);

  const hideOfficialBridgeItems = useMemo(() => {
    return selectedBridgeOption !== 0 || !!selectedToken?.extensions.external;
  }, [selectedBridgeOption, selectedToken]);

  const tokenList = useMemo(() => {
    return {
      from: tokens?.filter((token) => token.chainId === selectedChainId.from),
      to: tokens?.filter((token) => token.chainId === selectedChainId.to),
    };
  }, [selectedChainId, tokens]);

  const isForceThirdParty = useMemo(() => {
    const { from, to } = selectedChainId;
    const res = !bridgeChains.deposit.find((chain) => {
      return chain.id === (isWithdraw ? to : from);
    })?.official;
    return res;
  }, [selectedChainId, isTestnet, isWithdraw]);

  useEffect(() => {
    const defaultToken = tokens?.find(
      (token) =>
        token.chainId === (isForceThirdParty ? 1 : selectedChainId.from ?? 1) &&
        token.name === "Mantle"
    );
    if (defaultToken) {
      setSelectedToken(defaultToken);
    }
  }, [tokens, selectedChainId.from, isForceThirdParty]);

  useEffect(() => {
    const tokenPair = tokens?.find(
      (token) =>
        token.symbol === selectedToken?.symbol &&
        token.chainId === selectedChainId.to
    );
    setSelectedTokenPair(tokenPair);
  }, [selectedToken, selectedChainId, tokens]);

  const context = useMemo(() => {
    return {
      publicClient,
      tokenList,
      selectedBridgeOption,
      setSelectedBridgeOption,
      selectedChainId,
      setSelectedChainId,
      isTestnet,
      isWithdraw,
      hideOfficialBridgeItems,
      isForceThirdParty,
      selectedToken,
      selectedTokenPair,
      setSelectedToken,
      bridgeInputAmount,
      setBridgeInputAmount,
      recipient,
      setRecipient,
    } satisfies StateProps;
  }, [
    publicClient,
    tokenList,
    selectedBridgeOption,
    setSelectedBridgeOption,
    selectedChainId,
    setSelectedChainId,
    isTestnet,
    isWithdraw,
    hideOfficialBridgeItems,
    isForceThirdParty,
    selectedToken,
    selectedTokenPair,
    setSelectedToken,
    bridgeInputAmount,
    setBridgeInputAmount,
    recipient,
    setRecipient,
  ]);

  return (
    <StateProviderContext.Provider value={context}>
      {children}
    </StateProviderContext.Provider>
  );
};

export default StateProvider;
