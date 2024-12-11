"use client";

import AdBanner from "@/components/bridge/AdBanner";
import BridgeForm from "@/components/bridge/BridgeForm";
import SwitchBridgeTransition from "@/components/bridge/SwitchBridgeTransition";
import Faq from "@/components/bridge/Faq";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/animation";
import { motion } from "framer-motion";
import { useContext } from "react";
import { StateProviderContext } from "@/components/provider/StateProvider";

const BridgePage = () => {
  const { isTestnet, hideOfficialBridgeItems } =
    useContext(StateProviderContext);

  return (
    <>
      <motion.div
        animate="show"
        initial="hidden"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        viewport={{ once: true }}
        whileInView="show"
      >
        <div className="flex items-center flex-col justify-center gap-6">
          <AdBanner />
          <BridgeForm />
          <SwitchBridgeTransition isHidden={hideOfficialBridgeItems}>
            <Faq />
          </SwitchBridgeTransition>
        </div>
      </motion.div>
    </>
  );
};

export default BridgePage;
