import {
  mantle as mantleNoIcon,
  mantleSepoliaTestnet as mantleSepoliaTestnetNoIcon,
} from "mantle-viem-test/chains";
import {
  arbitrum as arbitrumNoIcon,
  base as baseNoIcon,
  bsc as binanceNoIcon,
  Chain,
  mainnet as mainnetNoIcon,
  optimism as optimismNoIcon,
  polygon as polygonNoIcon,
  sepolia as sepoliaNoIcon,
} from "wagmi/chains";
import { createPublicClient, fallback, http } from "viem";

export interface ChainWithIcon extends Chain {
  iconUrl: string;
  official?: boolean;
}

const base: ChainWithIcon = {
  ...baseNoIcon,
  iconUrl: "/icons/NetworkBaseTest.svg",
};

const polygon: ChainWithIcon = {
  ...polygonNoIcon,
  iconUrl: "/icons/NetworkPolygon.svg",
};

const bsc: ChainWithIcon = {
  ...binanceNoIcon,
  iconUrl: "/icons/NetworkBnb.svg",
};

const arbitrum: ChainWithIcon = {
  ...arbitrumNoIcon,
  iconUrl: "/icons/NetworkArbitrum.svg",
};

const optimism: ChainWithIcon = {
  ...optimismNoIcon,
  iconUrl: "/icons/optimism.svg",
};

const mainnet: ChainWithIcon = {
  ...mainnetNoIcon,
  iconUrl: "/icons/NetworkEthMainnet.svg",
  official: true,
};

const sepolia: ChainWithIcon = {
  ...sepoliaNoIcon,
  iconUrl: "/icons/NetworkEthMainnet.svg",
  official: true,
};

const mantle: ChainWithIcon = {
  ...mantleNoIcon,
  iconUrl: "/icons/NetworkMantle-dark.svg",
  official: true,
};

const mantleSepoliaTestnet: ChainWithIcon = {
  ...mantleSepoliaTestnetNoIcon,
  name: "Mantle Sepolia",
  iconUrl: "/icons/NetworkMantle-dark.svg",
  official: true,
};

export const allChains = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
  [mantle.id]: mantle,
  [mantleSepoliaTestnet.id]: mantleSepoliaTestnet,
  [base.id]: base,
  [optimism.id]: optimism,
  [arbitrum.id]: arbitrum,
  [bsc.id]: bsc,
  [polygon.id]: polygon,
};

export const bridgeChains = {
  // deposit: [mainnet, sepolia],
  // withdraw: [mantle, mantleSepoliaTestnet],

  deposit: [sepolia],
  withdraw: [mantleSepoliaTestnet],
  supported: [mantle, mantleSepoliaTestnet, mainnet, sepolia],
};

export const supportedChains = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
  [mantle.id]: mantle,
  [mantleSepoliaTestnet.id]: mantleSepoliaTestnet,
};

export const walletConfig = {
  chains: [
    // mainnet,
    sepolia,
    // mantle,
    mantleSepoliaTestnet,
  ] as const,
  transports: {
    // [mainnet.id]: fallback([http(`/api/rpc/${mainnet.id}`), http()]),
    [sepolia.id]: fallback([http(`/api/rpc/${sepolia.id}`), http()]),
    // [mantle.id]: fallback([http(`/api/rpc/${mantle.id}`), http()]),
    [mantleSepoliaTestnet.id]: fallback([
      http(`/api/rpc/${mantleSepoliaTestnet.id}`),
      http(),
    ]),
  },
};

export const publicClient = {
  [sepolia.id]: createPublicClient({
    chain: sepolia,
    transport: fallback([http(`/api/rpc/${sepolia.id}`), http()]),
  }),
  [mantleSepoliaTestnet.id]: createPublicClient({
    chain: mantleSepoliaTestnet,
    transport: fallback([http(`/api/rpc/${mantleSepoliaTestnet.id}`), http()]),
  }),
};
