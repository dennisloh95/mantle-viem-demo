import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import rpc from "./rpc";
import withdrawal from "./withdrawal";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal error" }, 500);
});

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/rpc", rpc).route("/withdrawal", withdrawal);

export const GET = handle(app);
export const POST = handle(app);
// export const PATCH = handle(app);
// export const DELETE = handle(app);

export type AppType = typeof routes;
