import { z } from "zod";

const MIN_PASSWORD_LENGTH = 12;
const MAX_BCRYPT_PASSWORD_BYTES = 72;

const getUtf8ByteLength = (value: string) => new TextEncoder().encode(value).length;

const emailSchema = z
  .string({ error: "Email wajib diisi." })
  .trim()
  .min(1, { error: "Email wajib diisi." })
  .toLowerCase()
  .pipe(z.email({ error: "Format email tidak valid." }));

const loginPasswordSchema = z
  .string({ error: "Password wajib diisi." })
  .min(1, { error: "Password wajib diisi." })
  .refine((password) => getUtf8ByteLength(password) <= MAX_BCRYPT_PASSWORD_BYTES, {
    error: "Password terlalu panjang.",
  });

const registerPasswordSchema = loginPasswordSchema
  .refine((password) => password.length >= MIN_PASSWORD_LENGTH, {
    error: `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`,
  })
  .refine((password) => /[a-z]/.test(password), {
    error: "Password harus memiliki setidaknya satu huruf kecil.",
  })
  .refine((password) => /[A-Z]/.test(password), {
    error: "Password harus memiliki setidaknya satu huruf besar.",
  })
  .refine((password) => /[0-9]/.test(password), {
    error: "Password harus memiliki setidaknya satu angka.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const registerSchema = z
  .object({
    name: z
      .string({ error: "Nama wajib diisi." })
      .trim()
      .min(2, { error: "Nama minimal 2 karakter." })
      .max(80, { error: "Nama maksimal 80 karakter." }),
    email: emailSchema,
    password: registerPasswordSchema,
    confirmPassword: z
      .string({ error: "Konfirmasi password wajib diisi." })
      .min(1, { error: "Konfirmasi password wajib diisi." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Konfirmasi password tidak sama.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
