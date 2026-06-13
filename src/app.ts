import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import cors from "@fastify/cors";

const app: FastifyInstance = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]});

app.register(routes);

export default app;
