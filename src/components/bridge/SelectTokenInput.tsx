"use client";

import { ChangeEvent, useContext } from "react";
import { StateProviderContext } from "../provider/StateProvider";
import TokenListModal from "./TokenListModal";
import SwitchBridgeTransition from "@/components/bridge/SwitchBridgeTransition";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const SelectTokenInput = () => {
  const {
    hideOfficialBridgeItems,
    bridgeInputAmount,
    setBridgeInputAmount,
    selectedToken,
  } = useContext(StateProviderContext);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let amount = e.currentTarget.value;
    const regex = new RegExp(`^\\d*(\\.\\d{0,${selectedToken?.decimals}})?$`);
    if (regex.test(amount)) {
      setBridgeInputAmount(amount);
    }
  };

  return (
    <>
      <div className="flex rounded-lg dark:border-[#41474D] dark:bg-[#1C1E20] w-full">
        <div
          className={`${
            hideOfficialBridgeItems
              ? "rounded-lg delay-500 duration-300"
              : "rounded-l-lg duration-300"
          } border border-[#C4C4C4] px-2 h-[50px] text-[#464646] dark:border-[#41474D] dark:text-[#C4C4C4] transition-all `}
        >
          <TokenListModal />
        </div>
        <SwitchBridgeTransition
          isHidden={hideOfficialBridgeItems}
          widthMode="100%"
          effects="width"
          duration={0.5}
        >
          <div
            className={cn(
              "relative flex w-full justify-between rounded-r-lg border border-[#C4C4C4] dark:border-[#41474D] border-l-0 focus-within:border-transparent focus-within:outline-none focus-within:ring-1 focus-within:ring-[#A8D0CD]"
              // (invalidInput || maxNativeNotEnoughGas) &&
              //   inputAmount !== "" &&
              //   "focus-within:ring-[#F26A1D]"
            )}
          >
            <Input
              value={bridgeInputAmount}
              onChange={handleInputChange}
              type="number"
              placeholder="0"
              className="h-auto w-full border-0 !text-[18px] font-bold focus-visible:ring-0 text-[#464646] dark:text-[#C4C4C4]"
              // onBlur={handleInputOnBlur}
              // disabled={zeroBalance || loadingMax}
            />
            <div className="flex items-center">
              <Button
                className="m-2 flex items-center"
                variant="default"
                size="sm"
                type="button"
                // onClick={handleMax}
                // disabled={zeroBalance || loadingMax}
              >
                <span>Max</span>
              </Button>
            </div>

            {/* {(invalidInput || maxNativeNotEnoughGas) && inputAmount !== "" && (
              <div className="absolute bottom-0 left-0 flex translate-y-[130%] items-center gap-1 text-xs text-[#F26A1D]">
                <Image
                  src={"/bridge/exclamation-orange.svg"}
                  width={12}
                  height={12}
                  alt="icon"
                />
                {invalidInput
                  ? invalidInput
                  : maxNativeNotEnoughGas
                  ? "Insufficient gas fee"
                  : ""}
              </div>
            )} */}
          </div>
        </SwitchBridgeTransition>
      </div>
    </>
  );
};

export default SelectTokenInput;
