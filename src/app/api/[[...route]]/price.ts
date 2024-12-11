import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

type CryptoPrice = Record<string, { usd?: number }>;

const app = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      ids: z.string(),
    }),
  ),
  async (c) => {
    const { ids } = c.req.valid("query");

    // coingecko full coins id list: https://api.coingecko.com/api/v3/coins/list
      const originHost = process.env.COINGECKO_API_KEY
  ? "https://pro-api.coingecko.com"
  : "https://api.coingecko.com"

const host = process.env.COINGECKO_PROXY_URL ?? originHost


      const url = `${host}/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": process.env.COINGECKO_PROXY_URL ? '':  process.env.COINGECKO_API_KEY || "",
      },
      next: { revalidate: 1800 }, // cache price every 30m
    };

    const data: CryptoPrice = await fetch(url, options).then((res) =>
      res.json(),
    );

    return c.json(data, 200, {
      "Cache-Control":
        "max-age=180, public, s-maxage=180, stale-while-revalidate=180",
    });
  },
);

export default app;
