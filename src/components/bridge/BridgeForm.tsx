import BridgeChainCard from "./BridgeChainCard";
import { useContext, useState } from "react";
import SwitchDirection from "./SwitchDirection";
import SelectTokenInput from "./SelectTokenInput";
import { Button } from "../ui/button";
import { StateProviderContext } from "../provider/StateProvider";
import BridgeActionBtn from "./BridgeActionBtn";

const BridgeForm = () => {
  const [isSwap, setIsSwap] = useState(false);

  return (
    <div
      className="w-full max-w-[480px] bg-card dark:bg[#1C1E20] py-10 px-6 rounded-xl"
      style={{
        boxShadow: "0px 0px 30px 0px rgba(101, 179, 174, 0.30)",
      }}
    >
      <div className="space-y-2">
        <div>
          <BridgeChainCard
            type={!isSwap ? "from" : "to"}
            className={isSwap ? "translate-y-[120px]" : ""}
          />
          <div
            className="flex items-center justify-center"
            onClick={() => setIsSwap((pre) => !pre)}
          >
            <SwitchDirection />
          </div>
          <BridgeChainCard
            type={!isSwap ? "to" : "from"}
            className={isSwap ? "translate-y-[-120px]" : ""}
          />
        </div>
        <div>
          <SelectTokenInput />
        </div>
        <BridgeActionBtn />
      </div>
    </div>
  );
};

export default BridgeForm;
