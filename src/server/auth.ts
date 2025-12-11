import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { db } from "./drizzle";
import { account, user, session, verification } from "./schema/auth-schema";
import { passwordSchema } from "@/lib/validation";
import { sendMail } from "./mailer";
import { env } from "@/lib/env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: { user, account, session, verification },
  }),

  emailAndPassword: {
    enabled: true,
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
      // validate password in server sside

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
    },
  },
});
