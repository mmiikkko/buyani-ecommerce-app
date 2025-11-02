import {betterAuth} from "better-auth";

const betterAuth = BetterAuth({
  providers: [
    {
      type: "email",
      sendVerificationRequest: async ({ identifier, url }) => {
        console.log(`Send email to ${identifier} with link: ${url}`);
      },
    },
  ],
  database: {
    type: "postgresql", // or mysql / sqlite
    url: process.env.DATABASE_URL,
  },
});

export const { auth, handlers } = betterAuth;

