import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import type { DeleteTransactionParams } from "../../schema/transaction.schema.js";

export const deleteTransaction = async (
  request: FastifyRequest<{ Params: DeleteTransactionParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;
  const { id } = request.params;

  if (!userId) {
    reply.status(401).send("Usuário não autenticado");
    return;
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      reply.status(404).send("Transação não encontrada");
      return;
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    reply.status(200).send("Transação deletada com sucesso");
  } catch (_error) {
    request.log.error("Erro ao deletar transação");
    reply.status(500).send("Erro ao deletar transação");
  }
};
