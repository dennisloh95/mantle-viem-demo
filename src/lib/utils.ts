import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenString(
  string: string | null,
  charNumber: number | undefined = 8
) {
  if (!string) {
    return "";
  }

  if (string.length <= charNumber) {
    return string;
  }

  return string.slice(0, charNumber - 4) + "..." + string.slice(-4);
}

export const checkIsTestnet = (chainId: number) => {
  return chainId === 11155111 || chainId === 5003;
};

export const checkIsWithdraw = (chainId: number, isTestnet: boolean) => {
  const mantleChainId = isTestnet ? 5003 : 5000;
  return chainId === mantleChainId;
};

export const checkUpdatedEnvChain = (
  isTestnet: boolean,
  isWithdraw: boolean
) => {
  if (isWithdraw) {
    return isTestnet ? 5003 : 5000;
  } else {
    return isTestnet ? 11155111 : 1;
  }
};

export function isLayer1(chainId: number): boolean {
  return [1, 11155111].indexOf(chainId) >= 0;
}
