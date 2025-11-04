import { z } from "zod";

const envSchema = z.object({
  DB_URI: z.string().nonempty("DB_URI is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Missing or invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
