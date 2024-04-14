import { type Config } from "drizzle-kit";

import { env } from "@/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    // uri: env.DATABASE_URL,
    uri: env.MYSQL_URL,

    // uri: env.RDS_URL,

    // host: env.RDS_HOST,
    // user: env.RDS_USER,
    // password: env.RDS_PASSWORD,
    // port: 3306,
    // database: "testdb",
  },
  tablesFilter: ["liftinglogic_*"],
} satisfies Config;
