import type { FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
//   const authHeader = request.headers.authorization;
const authHeader = request.headers.authorization;

  // biome-ignore lint/complexity/useOptionalChain: <Ahak3b>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.code(401).send({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    request.userId = decodedToken.uid
  } catch (_err) {
    request.log.error("Error verifying token:");
    reply.code(401).send({ message: "Token inválido ou expirado" });
  }
};

export default authMiddleware;