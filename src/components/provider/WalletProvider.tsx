"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { walletConfig } from "@/config/chains";
import {
  connectorsForWallets,
  darkTheme,
  DisclaimerComponent,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  bitgetWallet,
  bybitWallet,
  coin98Wallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  safepalWallet,
  tokenPocketWallet,
  trustWallet,
  walletConnectWallet,
  bitverseWallet,
  imTokenWallet,
  xdefiWallet,
  binanceWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi";
import { ReactNode, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { LinkComponent } from "../LinkComponent";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

const { chains, transports } = walletConfig;
const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        bybitWallet,
        binanceWallet,
        okxWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: "Others",
      wallets: [
        trustWallet,
        safepalWallet,
        tokenPocketWallet,
        coin98Wallet,
        bitverseWallet,
        bitgetWallet,
        imTokenWallet,
        xdefiWallet,
        rabbyWallet,
      ],
    },
  ],
  {
    appName: "Mantle Bridge",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains,
  transports,
  ssr: false,
  syncConnectedChain: true,
  multiInjectedProviderDiscovery: true,
});

export const wagmiConfigNew = createConfig({
  multiInjectedProviderDiscovery: false,
  chains,
  transports,
});

const queryClient = new QueryClient();

const Disclaimer: DisclaimerComponent = function Disclaimer({ Text, Link }) {
  return (
    <Text>
      By connecting your wallet, you hereby acknowledge that you have read and
      accept the{" "}
      <LinkComponent className="underline" href="https://www.mantle.xyz/terms">
        Terms of Service
      </LinkComponent>{" "}
      and{" "}
      <LinkComponent
        className="underline"
        href="https://www.mantle.xyz/privacy-policy"
      >
        Privacy Policy
      </LinkComponent>
    </Text>
  );
};

const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();

  const walletTheme = useMemo(() => {
    if (theme && theme == "dark") {
      return darkTheme({
        accentColor: "#65B3AE",
        accentColorForeground: "white",
        borderRadius: "large",
        fontStack: "system",
        overlayBlur: "none",
      });
    }
    return lightTheme({
      accentColor: "#65B3AE",
      accentColorForeground: "white",
      borderRadius: "large",
      fontStack: "system",
      overlayBlur: "none",
    });
  }, [theme]);

  // return (
  //   <DynamicContextProvider
  //     settings={{
  //       initialAuthenticationMode: "connect-only",
  //       // Find your environment id at https://app.dynamic.xyz/dashboard/developer
  //       environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
  //       walletConnectors: [EthereumWalletConnectors],
  //     }}
  //   >
  //     <WagmiProvider config={wagmiConfigNew}>
  //       <QueryClientProvider client={queryClient}>
  //         <DynamicWagmiConnector>
  //           {children}
  //           {/* <DynamicWidget />

  //           <div>hello world</div> */}
  //         </DynamicWagmiConnector>
  //       </QueryClientProvider>
  //     </WagmiProvider>
  //   </DynamicContextProvider>
  // );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{ disclaimer: Disclaimer }}
          theme={walletTheme}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;
