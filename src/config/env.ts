import "server-only";

import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const postgresUrlSchema = z
  .string()
  .trim()
  .min(1, "is required")
  .refine(
    (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
    "must be a PostgreSQL connection URL",
  );

const httpUrlSchema = z
  .url()
  .refine(
    (value) => value.startsWith("http://") || value.startsWith("https://"),
    "must be an HTTP or HTTPS URL",
  );

const envSchema = z.object({
  DATABASE_URL: postgresUrlSchema,
  AUTH_SECRET: z.string().trim().min(32, "must contain at least 32 characters"),
  AUTH_URL: z.preprocess(emptyStringToUndefined, httpUrlSchema.optional()),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.preprocess(
    emptyStringToUndefined,
    httpUrlSchema.default("http://localhost:3000"),
  ),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
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
