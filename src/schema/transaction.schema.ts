import { ObjectId } from "mongodb";
import { z } from "zod/v3";
import { TransactionType } from "@prisma/client";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
  amount: z.number().positive("Valor deve ser positivo"),
  date: z.coerce.date({
    errorMap: () => ({ message: "Data inválida" }),
  }),
  categoryId: z.string().refine(isValidObjectId, {
    message: "Categoria inválida",
  }),
  type: z.enum([TransactionType.expense, TransactionType.income], {
    errorMap: () => ({ message: "Enum inválido" }),
  }),
});

export const getTransactionsSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  type: z
    .enum([TransactionType.expense, TransactionType.income], {
      errorMap: () => ({ message: "Enum Inválido" }),
    })
    .optional(),
  categoryId: z
    .string()
    .refine(isValidObjectId, {
      message: "Categoria Inválida!",
    })
    .optional(),
});

export const getTransactionsSummarySchema = z.object({
  month: z.string({ message: "Mês é obrigatório!" }),
  year: z.string({ message: "Ano é obrigatório!" }),
});

export const getHistoricalTransactionsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months: z.coerce.number().min(1).max(12).optional(),
});

export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, {
    message: "ID de transação inválido",
  }),
});

export type GetHistoricalTransactionsQuerry = z.infer<
  typeof getHistoricalTransactionsSchema
>;
export type GetTransactionQuerry = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSummaryQuery = z.infer<
  typeof getTransactionsSummarySchema
>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
