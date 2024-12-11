import { AnimatePresence, motion } from "framer-motion";

export default function BridgeTransition({
  isHidden = false,
  effects = "height",
  widthMode = "auto",
  duration = 0.3,
  children,
  className,
}: {
  isHidden?: boolean;
  effects?: "height" | "width" | "both";
  children: React.ReactNode;
  className?: string;
  duration?: number; // seconds
  widthMode?: "100%" | "auto";
}) {
  return (
    <AnimatePresence>
      {!isHidden && children ? (
        <motion.div
          initial={{
            opacity: 0,
            ...(effects == "width"
              ? { width: 0 }
              : effects == "both"
              ? { height: 0, width: 0 }
              : { height: 0 }),
          }}
          animate={{
            opacity: 1,
            ...(effects == "width"
              ? { width: widthMode }
              : effects == "both"
              ? { height: "auto", width: widthMode }
              : { height: "auto" }),
          }}
          exit={{
            opacity: 0,
            ...(effects == "width"
              ? { width: 0 }
              : effects == "both"
              ? { height: 0, width: 0 }
              : { height: 0 }),
          }}
          transition={{ duration }}
          className={className}
        >
          {!isHidden && children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
