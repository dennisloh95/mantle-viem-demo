import React, { ReactNode } from "react";

const BridgeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full px-4 py-6 flex items-center flex-col justify-center">
      {children}
    </div>
  );
};

export default BridgeLayout;
