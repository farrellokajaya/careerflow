import { z } from "zod";

const postgresUrlSchema = z
  .string()
  .min(1, "is required")
  .refine(
    (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
    "must be a PostgreSQL connection URL",
  );

const envSchema = z.object({
  DATABASE_URL: postgresUrlSchema,
  DIRECT_URL: postgresUrlSchema,
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `- ${issue.path.join(".") || "environment"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment variables:\n${details}`);
}

export const env = parsedEnv.data;
