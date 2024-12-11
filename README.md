<a id="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/mantle-xyz/mantle-superapp">
    <img src="public/favicon/apple-touch-icon-120x120.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Mantle Super App</h3>

  <p align="center">
    Mantle Super App is design to handle multiple utilities in Mantle Chain. (e.g. Bridge, Faucet)
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#tech-stack">Tech Stack</a>
    </li>
    <li>
      <a href="#directory">Directory</a>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#environment-variables">Environment Variables</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>



<!-- TECH STACK -->
## Tech Stack

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

- **Framework**: Nest.js
- **Language**: TypeScript
- **UI Library**: Shadcn UI
- **Wallet Provider**: RainbowKit
- **Web3 Interface**: Viem
- **Dependency Management**: pnpm


<!-- GETTING STARTED -->
## Directory

The project is organized into the following main directories and files:

```

  ├── app/                         # Handles activities and their configurations
  │   ├── (general)/               # General Nextjs Page & Layout
  │   ├── api/                     # Internal API helpers
  │   ├── bridge/                  # Bridge related pages
  ├── assets/                      # Static assets of project
  │   ├── fonts/                   # Project theme fonts
  ├── components/                  # Reusable components
  │   ├── ui/                      # Shadcn UI components
  │   ├── bridge/                  # Bridge related components
  │   ├── layout/                  # Layout related components (e.g. Header, Footer)
  │   ├── providers/               # Providers of the project
  │      ├── BridgeStateProvider   # Global state management
  │      └── WalletProvider        # Manage project wallet connection
  ├── config/                      # Config of Project
  ├── data/                        # Json data (e.g. Thirdparty Bridge config)
  ├── hooks/                       # Reusable react hooks
  ├── lib/                         # Library management 
  │   ├── date/                    # Date formatter
  │   ├── hooks/                   # Reusable hooks
  │   ├── utils/                   # Utility helpers (e.g. FormatNum, FormatWei)
  └── types/                       # Project types
  └── tsconfig.json                # TypeScript configuration
```

<!-- GETTING STARTED -->
## Getting Started

Add your `.env.local` file, copy the content from `.env.example` to it.

Install and run the development server:

```bash
pnpm install
pnpm dev
```





<!-- ENVIRONMENT VARIABLES -->
## Environment Variables

| Variable              | Description                                                        |
| :-------------------- | :----------------------------------------------------------------- |
| `NEXT_PUBLIC_WC_PROJECT_ID`    | Wallet Connect Project ID |
| `COINGECKO_API_KEY`         | Coingecko API Key           |
| `COINGECKO_PROXY_URL`         | Internal CoinGecko Proxy URL          |
| `MAINNET_RPC` | Ethereum RPC      |
| `SEPOLIA_RPC` | Ethereum Sepolia RPC      |
| `MANTLE_RPC` | Mantle RPC      |
| `MANTLE_SEPOLIA_RPC` | Mantle Sepolia RPC      |
| `BRIDGE_LITHOSPHERE_API_URL`         |  Lithosphere API URL             |
| `BRIDGE_LITHOSPHERE_API_URL_TESTNET`         | Testnet Lithosphere API URL                   |

When deploying, you may need to [set the branch's corresponding environment variables](https://vercel.com/changelog/environments-variables-per-git-branch).



<!-- ROADMAP -->
## Roadmap

- [x] Bridge Logic (Deposit & Withdraw)
- [x] Third Party Bridge
- [x] Error Toast
- [x] Token Price
- [x] Testnet & Mainnet Environment
- [x] Bridge History
- [x] Multi Wallet Support
    - [x] Metamask
    - [x] OKX Wallet
    - [x] Bybit Wallet
    - [x] Binance Wallet
    - [x] Wallet Connect
    - [x] Trust Wallet
    - [x] SafePal Wallet
    - [x] TokenPocket
    - [x] Coin98 Wallet
    - [x] Bitverse Wallet
    - [x] Bitget Wallet
    - [x] imToken
    - [x] XDEFI Wallet
    - [x] Rabby Wallet
- [ ] Faucet


<p align="right">(<a href="#readme-top">back to top</a>)</p>

