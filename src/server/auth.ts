import { env } from "@/lib/env";
import { passwordSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { db } from "./drizzle";
import { sendMail } from "./mailer";
import { account, session, user, verification } from "./schema/auth-schema";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: { user, account, session, verification },
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  emailAndPassword: {
    enabled: true,
    password: {
      // Always hash new passwords using Better Auth's own hasher (scrypt)
      async hash(password) {
        return hashPassword(password);
      },
      // Support both Better Auth hashes and old bcrypt hashes to avoid
      // "Invalid password hash" errors for existing users.
      async verify({ hash, password }) {
        // New / proper Better Auth hashes: "salt:hexkey"
        if (hash?.includes(":")) {
          try {
            return await verifyPassword({ hash, password });
          } catch {
            return false;
          }
        }

        // Legacy bcrypt hashes (no colon)
        try {
          return await bcrypt.compare(password, hash);
        } catch {
          return false;
        }
      },
    },
    async sendResetPassword({ user, url }) {
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        text: "Click the link to reset your password: " + url,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendMail({
        to: user.email,
        subject: "Verify your email",
        text: "Click the link to verify your email: " + url,
      });
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, newEmail, url }) {
        await sendMail({
          to: user.email,
          subject: "Approve email change",
          text: `Your email has been changed to ${newEmail}. Click the link to approve the change: ${url}`,
        });
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      first_name: {
        type: "string",
        required: false,
        input: true,
      },
      last_name: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // validate password in server side

      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);

        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // ADD THIS: Explicit redirect URI that matches Google Console
      redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },
});