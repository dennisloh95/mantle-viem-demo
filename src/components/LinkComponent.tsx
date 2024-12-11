"use client";

import { HTMLAttributes } from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface LinkComponentProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  isExternal?: boolean;
  target?: string;
  passRef?: boolean;
  legacyBehavior?: boolean;
  externalIcon?: boolean;
}

export function LinkComponent({
  href,
  children,
  isExternal,
  className,
  target = "_blank",
  externalIcon = false,
  ...props
}: LinkComponentProps) {
  const pathname = usePathname();
  const classes = cn(className, {
    active: pathname === href,
  });
  const isExternalEnabled =
    href.match(/^([a-z0-9]*:|.{0})\/\/.*$/) || isExternal;

  if (isExternalEnabled) {
    return (
      <a
        className={classes}
        href={href}
        rel="noopener noreferrer"
        target={target}
        {...props}
      >
        {children}
        {externalIcon && (
          <svg
            className="ml-1"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.99935 3.33301V4.66634H10.3927L2.66602 12.393L3.60602 13.333L11.3327 5.60634V9.99967H12.666V3.33301H5.99935Z"
              fill="currentColor"
            />
          </svg>
        )}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} {...props}>
      {children}
    </Link>
  );
}
