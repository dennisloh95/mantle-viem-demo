import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Skeleton as SkeletonWrapper } from "./ui/skeleton";

interface SkeletonProps {
  children: ReactNode;
  isLoaded: boolean;
  className?: string;
}

const Skeleton = ({ children, isLoaded, className }: SkeletonProps) => {
  return (
    <>
      {isLoaded ? (
        children
      ) : (
        <SkeletonWrapper className={cn(className, "")}>
          <div className="opacity-0">{children}</div>
        </SkeletonWrapper>
      )}
    </>
  );
};

export default Skeleton;
