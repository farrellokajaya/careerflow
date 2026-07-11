import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { env } from "@/config/env";
import { Role } from "@/generated/prisma/client";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validations/auth";

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

class InactiveAccountError extends CredentialsSignin {
  code = "account_inactive";
}

function isRole(value: unknown): value is Role {
  return value === Role.USER || value === Role.ADMIN;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email dan Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            password: true,
            isActive: true,
          },
        });

        if (!user?.password) {
          return null;
        }

        const passwordMatches = await verifyPassword(password, user.password);

        if (!passwordMatches) {
          return null;
        }

        if (!user.isActive) {
          throw new InactiveAccountError();
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (!user?.id) {
        return token;
      }

      const authorization = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          role: true,
          isActive: true,
        },
      });

      if (!authorization) {
        throw new Error("Authenticated user is unavailable.");
      }

      token.userId = user.id;
      token.role = authorization.role;
      token.isActive = authorization.isActive;

      return token;
    },
    async session({ session, token }) {
      if (
        typeof token.userId !== "string" ||
        !isRole(token.role) ||
        typeof token.isActive !== "boolean"
      ) {
        throw new Error("Invalid authentication token.");
      }

      if (!session.user) {
        throw new Error("Invalid authentication session.");
      }

      Object.assign(session.user, {
        id: token.userId,
        role: token.role,
        isActive: token.isActive,
      });

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/") && !url.startsWith("//")) {
        return new URL(url, baseUrl).toString();
      }

      try {
        const parsedUrl = new URL(url);
        const parsedBaseUrl = new URL(baseUrl);

        if (parsedUrl.origin === parsedBaseUrl.origin) {
          return parsedUrl.toString();
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
  },
});
