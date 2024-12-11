import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { z } from "zod";

type Params = unknown[];

const rpc: Record<string, string | undefined> = {
  "11155111": process.env.NEXT_PUBLIC_BRIDGE_SEPOLIA_RPC,
  "5000": process.env.NEXT_PUBLIC_BRIDGE_MANTLE_RPC,
  "5003": process.env.NEXT_PUBLIC_BRIDGE_MANTLE_SEPOLIA_RPC,
  "1": process.env.NEXT_PUBLIC_BRIDGE_MAINNET_RPC,
};

const app = new Hono().post(
  "/:chainId",
  zValidator(
    "json",
    z.object({
      id: z.number(),
      jsonrpc: z.string(),
      method: z.string(),
      params: z.custom<Params>(),
    })
  ),
  async (c) => {
    const chainId = c.req.param("chainId");

    const { id, jsonrpc, method, params } = c.req.valid("json");

    if (!rpc[chainId]) {
      return c.json({ error: "rpc not found" }, 404);
    }

    try {
      const res = await fetch(rpc[chainId], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, jsonrpc, method, params }),
      });
      const result = await res.json();

      return c.json(result, 200);
    } catch (_) {
      return c.json({ error: "Something went wrong" }, 500);
    }
  }
);

export default app;
