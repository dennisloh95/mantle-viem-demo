"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Toggle } from "./ui/toggle";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleSetTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <>
      <Toggle
        pressed={theme === "light"}
        onPressedChange={handleSetTheme}
        className={cn(
          "data-[state=on]:bg-transparent size-12 duration-300 transition-all",
          "hover:data-[state=on]:bg-[#CFD6E6] !dark:hover:bg-[#1C1E20] "
        )}
      >
        <Image
          src="/bridge/MoonIcon.svg"
          alt="dark mode"
          width={22}
          height={22}
          className={cn(theme === "dark" && "hidden")}
        />
        <Image
          src="/bridge/SunIcon.svg"
          alt="light mode"
          width={22}
          height={22}
          className={cn(theme === "light" && "hidden")}
        />
      </Toggle>
    </>
  );
};

export default ThemeToggle;
