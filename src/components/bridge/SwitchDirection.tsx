"use client";

import { useContext, useState } from "react";
import Image from "next/image";

import { Button } from "../ui/button";
import { StateProviderContext } from "../provider/StateProvider";

export default function SwitchDirection() {
  const { setSelectedChainId, selectedChainId } =
    useContext(StateProviderContext);

  const [isSwap, setIsSwap] = useState<boolean>(false);

  const handleDirectionSwtich = () => {
    const { from, to } = selectedChainId;
    setSelectedChainId({
      from: to,
      to: from,
    });
    setIsSwap((pre) => !pre);
  };

  return (
    <Button
      variant="ghost"
      className={`flex p-0 hover:bg-transparent h-[40px] items-center justify-center hover:opacity-80 transition-all ease-in-out duration-500 ${
        isSwap ? "rotate-180" : "rotate-0"
      }`}
      onClick={handleDirectionSwtich}
    >
      <Image
        src="/bridge/SwitchIcon.svg"
        alt="switch"
        width={24}
        height={24}
        className="size-6"
      />
      <span className="sr-only">switch</span>
    </Button>
  );
}
