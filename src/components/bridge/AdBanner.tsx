import Image from "next/image";
import { LinkComponent } from "../LinkComponent";

export default function AdBanner() {
  return (
    <LinkComponent
      href="https://www.mantle.xyz/fiatonramp"
      className="relative  w-full sm:w-[405px] flex items-center justify-center hover:opacity-80"
    >
      <Image alt="banner" src="/bridge/AdBanner.svg" height={57} width={310} />
    </LinkComponent>
  );
}
