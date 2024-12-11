import localFont from "next/font/local";

export const GTWalsheim = localFont({
  src: [
    {
      path: "../assets/fonts/GT-Walsheim-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/GT-Walsheim-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-GTWalsheim",
});
