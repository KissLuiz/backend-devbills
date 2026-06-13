import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { TransactionType } from "../../../generated/prisma/client.js";
import prisma from "../../config/prisma.js";
import type { GetTransactionsSummaryQuery } from "../../schema/transaction.schema.js";
import type { CategorySummary } from "../../types/category.types.js";
import type { TransactionSummary } from "../../types/transaction.types.js";

dayjs.extend(utc);

export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: GetTransactionsSummaryQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send("Usuário não autenticado");
    return;
  }

  const { month, year } = request.query;

  if (!month || !year) {
    reply.status(400).send("Mês e ano são obrigatórios");
    return;
  }

  const startDate = dayjs.utc(`${year}=${month}-01`).startOf("month").toDate();
  const endDate = dayjs.utc(startDate).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    let totalExpenses = 0;
    let totalIncome = 0;
    const groupedExpenses = new Map<string, CategorySummary>();

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.expense) {
        const existing = groupedExpenses.get(transaction.categoryId) ?? {
          categoryId: transaction.categoryId,
          categoryName: transaction.category.name,
          categoryColor: transaction.category.color,
          amount: 0,
          percentage: 0,
        };

        existing.amount += transaction.amount;
        groupedExpenses.set(transaction.categoryId, existing);

        totalExpenses += transaction.amount;
      } else {
        totalIncome += transaction.amount;
      }
    }

    const summary: TransactionSummary = {
      totalExpenses,
      totalIncome,
      balance: Number((totalIncome - totalExpenses).toFixed(2)),
      expensesByCategory: Array.from(groupedExpenses.values())
        .map((entry) => ({
          ...entry,
          percentage: Number.parseFloat(
            ((entry.amount / totalExpenses) * 100).toFixed(2),
          ),
        }))
        .sort((a, b) => b.amount - a.amount),
    };

    reply.send(summary);
  } catch (_err) {
    request.log.error("Erro ao trazer transactions");
    reply.status(500).send({ error: "Erro no servidor" });
  }
};
