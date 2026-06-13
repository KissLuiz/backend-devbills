import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export const PrismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log("DB Conectado com Sucesso");
  } catch (err) {
  console.error("Falha ao conectar ao DB");
  console.error(err);
}
};

export default prisma;
