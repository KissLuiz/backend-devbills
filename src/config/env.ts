import dotenv from "dotenv";
import { z } from "zod/v3";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default("3001"),
  DATABASE_URL: z.string().min(20, "DATABASE_URL É OBRIGATÓRIO!"),
  NODE_ENV: z.enum(["dev", "teste", "prod"], {
    message: "NODE_ENV INVÁLIDO!",
  }),

  // Firebase   
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Variaveis de ambiente INVÁLIDAS");
  process.exit(1);
}

export const env = _env.data;
