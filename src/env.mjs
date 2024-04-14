import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PUSHER_HOST: z.string(),

    PUSHER_PORT: z.string(),
    PUSHER_APP_ID: z.string(),
    PUSHER_APP_KEY: z.string(),
    PUSHER_APP_SECRET: z.string(),

    RDS_PASSWORD: z.string(),
    RDS_HOST: z.string(),
    RDS_URL: z.string(),
    RDS_USER: z.string(),
    // RDS_PORT: z.number(),

    MYSQLDATABASE: z.string(),
    MYSQLHOST: z.string(),
    MYSQLPASSWORD: z.string(),
    // MYSQLPORT: z.number(),
    MYSQLUSER: z.string(),
    MYSQL_DATABASE: z.string(),
    MYSQL_PRIVATE_URL: z.string(),
    MYSQL_ROOT_PASSWORD: z.string(),
    MYSQL_URL: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
    NEXT_PUBLIC_PUSHER_HOST: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    PUSHER_HOST: process.env.PUSHER_HOST,

    PUSHER_PORT: process.env.PUSHER_PORT,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
    NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    NEXT_PUBLIC_PUSHER_HOST: process.env.NEXT_PUBLIC_PUSHER_HOST,

    RDS_PASSWORD: process.env.RDS_PASSWORD,
    RDS_HOST: process.env.RDS_HOST,
    RDS_URL: process.env.RDS_URL,
    RDS_USER: process.env.RDS_USER,
    // RDS_PORT: process.env.RDS_PORT,

    MYSQLDATABASE: process.env.MYSQLDATABASE,
    MYSQLHOST: process.env.MYSQLHOST,
    MYSQLPASSWORD: process.env.MYSQLPASSWORD,
    // MYSQLPORT: process.env.MYSQLPORT,
    MYSQLUSER: process.env.MYSQLUSER,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_PRIVATE_URL: process.env.MYSQL_PRIVATE_URL,
    MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
    MYSQL_URL: process.env.MYSQL_URL,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
