import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transactions/createTransaction.controller.js";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller.js";
import { getHistoricalTransactions } from "../controllers/transactions/getHistoricalTransactions.controller.js";
import { getTransactions } from "../controllers/transactions/getTransactions.controller.js";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller.js";
import authMiddleware from "../middlewares/auth.middleare.js";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getHistoricalTransactionsSchema,
  getTransactionsSchema,
  getTransactionsSummarySchema,
} from "../schema/transaction.schema.js";

const transactionRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", authMiddleware);

  // Criar Transação

  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: zodToJsonSchema(createTransactionSchema),
    },
    handler: createTransaction,
  });

  // Buscar transações com filtros

  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: zodToJsonSchema(getTransactionsSchema),
    },
    handler: getTransactions,
  });

  // Buscar o resumo das transações por mês e ano

  fastify.route({
    method: "GET",
    url: "/summary",
    schema: {
      querystring: zodToJsonSchema(getTransactionsSummarySchema),
    },
    handler: getTransactionsSummary,
  });

  // Buscar histórico dos últimos seis meses.

  fastify.route({
    method: "GET",
    url: "/historical",
    schema: {
      querystring: zodToJsonSchema(getHistoricalTransactionsSchema),
    },
    handler: getHistoricalTransactions,
  });

  // Deletar transação

  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      params: zodToJsonSchema(deleteTransactionSchema),
    },
    handler: deleteTransaction,
  });
};

export default transactionRoutes;
