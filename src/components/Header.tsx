"use client";

import React from "react";
import { LinkComponent } from "./LinkComponent";
import Image from "next/image";
import useScroll from "@/hooks/useScroll";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });

const routes = [
  {
    name: "Migrate",
    href: "https://migratebit.mantle.xyz",
  },
  {
    name: "Bridge",
    href: "/bridge",
  },
  {
    name: "History",
    href: "/bridge/history",
  },
];

const Header = () => {
  const scrolled = useScroll(0);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        " sticky top-0 z-50 backdrop-blur transition-all duration-300 ",
        scrolled && "bg-background/50"
      )}
    >
      {/* desktop */}
      <div className="hidden md:block">
        <div className="flex w-full justify-between h-[72px] px-[24px]">
          <LinkComponent
            href="/"
            className="flex flex-1 items-center space-x-2"
          >
            <Image
              alt="logo"
              src="/logo-dark.svg"
              height={38}
              width={138}
              className="brightness-0 dark:invert"
            />
          </LinkComponent>
          <nav className="flex items-center justify-center space-x-1 text-base font-medium">
            {routes.map((route) => (
              <LinkComponent
                externalIcon
                key={route.href}
                href={route.href}
                className={cn(
                  "relative text-[#696969] items-center h-9 px-4 py-2 flex justify-center transition-colors hover:text-accent-foreground dark:text-[#C4C4C4] hover:dark:text-[white] duration-500",
                  `${
                    pathname === route.href &&
                    "pointer-events-none text-[#464646] after:absolute after:bottom-0 after:block after:h-px after:w-3/5 after:bg-[#464646] dark:text-white dark:after:bg-white"
                  }`
                )}
              >
                {route.name}
              </LinkComponent>
            ))}
          </nav>
          <div className="flex items-center justify-end space-x-4 flex-1">
            <ThemeToggle />
            {/* <DynamicWidget /> */}
            <ConnectButton />
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="flex md:hidden">mobile header</div>
    </header>
  );
};

export default Header;
