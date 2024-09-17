import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
    server: {
        POSTGRES_PRISMA_URL: z
            .string()
            .url()
            .refine(
                (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
                "You forgot to change the default URL",
            ),
        POSTGRES_URL_NON_POOLING: z.string().url(),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        NEXTAUTH_SECRET:
            process.env.NODE_ENV === "production"
                ? z.string()
                : z.string().optional(),
        NEXTAUTH_URL: z.preprocess(
            (str) => process.env.VERCEL_URL ?? str,
            process.env.VERCEL ? z.string() : z.string().url(),
        ),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),

        // Nodemailer
        NODEMAILER_EMAIL: z.string(),
        NODEMAILER_SECRET: z.string(),

        // Instagram
        INSTAGRAM_CLIENT_SECRET: z.string(),

        // Monobank
        MONOBANK_TEST_TOKEN: z.string(),

        // Fondy
        FONDY_MERCHANT_ID: z.string(),
        FONDY_TRANSACTION_KEY: z.string(),

        BLOB_READ_WRITE_TOKEN: z.string(),

        // Telegram
        TELEGRAM_BOT_API_KEY: z.string(),
        TELEGRAM_VERIFICATION_BOT_API_KEY: z.string(),
    },

    /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
    client: {
        NEXT_PUBLIC_INSTAGRAM_CLIENT_ID: z.string(),
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string(),
        NEXT_PUBLIC_SITE_URL: z.string().url(),
        NEXT_PUBLIC_TINY_MCE_SECRET: z.string(),
    },

    /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
    runtimeEnv: {
        POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
        NODEMAILER_SECRET: process.env.NODEMAILER_SECRET,
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_TINY_MCE_SECRET: process.env.NEXT_PUBLIC_TINY_MCE_SECRET,
        NEXT_PUBLIC_INSTAGRAM_CLIENT_ID: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
        INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
        TELEGRAM_BOT_API_KEY: process.env.TELEGRAM_BOT_API_KEY,
        TELEGRAM_VERIFICATION_BOT_API_KEY: process.env.TELEGRAM_VERIFICATION_BOT_API_KEY,
        FONDY_MERCHANT_ID: process.env.FONDY_MERCHANT_ID,
        FONDY_TRANSACTION_KEY: process.env.FONDY_TRANSACTION_KEY,
        MONOBANK_TEST_TOKEN: process.env.MONOBANK_TEST_TOKEN,
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    },
    /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
    skipValidation: true,
    /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
    emptyStringAsUndefined: true,
});
