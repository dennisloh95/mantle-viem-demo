"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  const { address } = useAccount();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  // const switchToTestnet = () => {
  //   if (!address && openConnectModal) {
  //     openConnectModal()
  //     return
  //   }
  //   if (isTestnet) return
  //   switchChain({ chainId: 5003 })
  // }

  const faqContent = [
    {
      title: "How can I qualify for the MNT bonus?",
      content: (
        <>
          <p>
            Deposit any token from Ethereum Mainnet to Mantle Network to receive
            a dust bonus in MNT. Limited to once per wallet address.
          </p>
          <br />
          <Link
            href="https://www.mantle.xyz/blog/announcements/bridging-on-mantle-mainnet"
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-[#4D9D98]"
          >
            Learn more
          </Link>
        </>
      ),
    },
    {
      title: "Is there a testnet option for me to try things out first?",
      content: (
        <>
          <p>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Yes. You may choose the "Sepolia" option in the drop-down menu to
            try out the bridge.
          </p>

          {/* {(!isTestnet || !address) && (
            <>
              <br />
              <span
                className="underline hover:text-[#4D9D98] cursor-pointer"
                onClick={switchToTestnet}
              >
                Try on Testnet Bridge
              </span>
            </>
          )} */}
        </>
      ),
    },
    {
      title:
        "What is L1/L2, and what are the required gas fees for deposit and withdrawal?",
      content: (
        <>
          Mantle Network is a Layer-2 (L2) scalability solution built on
          Ethereum which is the Layer-1 (L1).
          <br />
          <br />
          <ul className="ml-6 list-disc">
            <li>
              Deposit: You need ETH on L1 as gas fees to initiate the deposit.
              After depositing, you&apos;ll need MNT on L2 as gas fees to
              transact on Mantle Network.
            </li>
            <li>
              Withdraw: You need MNT on L2 as gas fees to initiate the
              withdrawal and ETH on L1 as gas fees to claim the tokens on
              Ethereum Mainnet.
            </li>
          </ul>
          <br />
          <Link
            href="https://www.mantle.xyz/blog/announcements/bridging-on-mantle-mainnet"
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-[#4D9D98]"
          >
            Learn more
          </Link>
        </>
      ),
    },
    {
      title:
        "How can I view my bridged token balances on Mantle Network in my wallet?",
      content: (
        <>
          <p>
            If the auto-detection of your bridged balances doesn&apos;t work,
            you can manually import the tokens to your wallet using the
            following contract addresses:
          </p>
          <br />
          <ul className="ml-6 list-disc break-all">
            <li>ETH: 0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111</li>
            <li>USDT: 0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE</li>
            <li>USDC: 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9</li>
          </ul>
          <br />
          <p>
            For other token contract addresses, you can access the bridge token
            mapping by visiting the following{" "}
            <Link
              href="https://docs-v2.mantle.xyz/devs/dev-guides/quick#token-list"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-[#4D9D98]"
            >
              link
            </Link>
            , which directs you to the Mantle documentation.
          </p>
        </>
      ),
    },
    {
      title: "What is the typical duration for deposit and withdrawal?",
      content: (
        <>
          <p>Initiating a deposit typically completes in around ~1 minute.</p>
          <br />
          <p>
            Conversely, withdrawals, due to the intricacies of Optimistic
            Rollups, have a challenge period to detect and address any
            discrepancies in the Mantle Mainnet transaction. This ensures the
            highest security, but means withdrawals to Ethereum Mainnet can take
            up to a week.
          </p>
        </>
      ),
    },
    {
      title: "Where can I find the bridge token mapping?",
      content: (
        <>
          <p>
            You can view the bridge token mapping by visiting this{" "}
            <Link
              href="https://docs-v2.mantle.xyz/devs/dev-guides/quick#token-list"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-[#4D9D98]"
            >
              link
            </Link>
            , which will bring you to the Mantle Tech Docs.
          </p>
        </>
      ),
    },
  ];

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full max-w-[480px] rounded-2xl bg-[white] p-6 text-sm text-[#464646] dark:bg-[#1C1E20] dark:text-[#C4C4C4]"
    >
      {faqContent.map((item, i) => (
        <AccordionItem
          key={i}
          value={item.title}
          className={cn(`${i + 1 === faqContent.length ? "border-none" : ""}`)}
        >
          <AccordionTrigger className="gap-3 text-[16px] text-left font-medium hover:no-underline break-words">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="break-words">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Faq;
