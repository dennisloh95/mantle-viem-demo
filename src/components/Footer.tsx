import Image from "next/image";
import React from "react";
import { LinkComponent } from "./LinkComponent";

const Footer = () => {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-xs text-[#464646] mt-auto">
      <Image
        src={"/bridge/logo-mantle-minimal.svg"}
        width={17}
        height={16}
        alt="Mantle logo"
      />
      <div>
        &#169; Mantle {new Date().getFullYear()} |{" "}
        <LinkComponent href="https://www.mantle.xyz/terms">T&Cs</LinkComponent>{" "}
        ·{" "}
        <LinkComponent href="https://www.mantle.xyz/privacy-policy">
          Privcy Policy
        </LinkComponent>
      </div>
    </div>
  );
};

export default Footer;
