import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export type WithdrawalListItem = {
  guid: string;
  l2BlockNumber: number;
  msgNonce: number;
  l2TransactionHash: string;
  l2WithdrawTransactionHash: string;
  l1ProveTxHash: string;
  l1FinalizeTxHash: string;
  status: number;
  fromAddress: string;
  ETHAmount: number;
  ERC20Amount: number;
  gasLimit: number;
  timeLeft: number;
  toAddress: string;
  l1TokenAddress: string;
  l2TokenAddress: string;
  timestamp: number;
  prove_timestamp: number;
};

export type WithdrawalListResponse = {
  Current: number;
  Size: number;
  Total: number;
  Records: Array<WithdrawalListItem>;
};

const app = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      address: z.string(),
      page: z.string(),
      pageSize: z.string(),
      testnet: z.string().optional(),
      status: z.string().optional(),
    })
  ),
  async (c) => {
    const { address, testnet, status, page, pageSize } = c.req.valid("query");

    const lithosphereURL =
      testnet === "true"
        ? process.env.BRIDGE_LITHOSPHERE_API_URL_TESTNET
        : process.env.BRIDGE_LITHOSPHERE_API_URL;

    if (!lithosphereURL) {
      return c.json({ error: "not found" }, 404);
    }

    const data: WithdrawalListResponse = await fetch(
      `${lithosphereURL}/api/v1/withdrawals?address=${address}&page=${page}&pageSize=${pageSize}&order=desc${
        status ? `&status=${status}` : ""
      }`,
      {
        cache: "no-store",
      }
    ).then((res) => res.json());

    return c.json(data, 200);
  }
);

export default app;
