import { z } from "zod";

const envSchema = z.object({
  DB_URI: z.string().nonempty("DB_URI is required"),
  BETTER_AUTH_URL: z.string().nonempty("BETTER_AUTH_URL is required"),
  BETTER_AUTH_SECRET: z.string().nonempty("BETTER_AUTH_SECRET is required"),
  GMAIL_USER: z.string().email("GMAIL_USER must be a valid email"),
  GMAIL_APP_KEY: z.string().nonempty("GMAIL_APP_KEY is required"),
  GOOGLE_CLIENT_ID: z.string().nonempty("GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().nonempty("GOOGLE_CLIENT_SECRET is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Missing or invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
