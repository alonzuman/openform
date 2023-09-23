import z from "zod";

const serverSchema = z.object({
  VERCEL_URL: z.string().optional(),
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export const serverEnv = serverSchema.parse(process.env);
