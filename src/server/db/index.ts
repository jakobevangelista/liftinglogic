import { Client } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "@/env.mjs";
import * as schema from "./schema";

// export const db = drizzle(
//   new Client({
//     // url: env.DATABASE_URL,
//     // url: env.RDS_URL,
//     url: env.MYSQL_URL,
//   }).connection(),
//   { schema },
// );

import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2/promise";

const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn =
  globalForDb.conn ??
  createPool({
    uri: env.MYSQL_URL,
    // host: env.RDS_HOST,
    // user: env.RDS_USER,
    // password: env.RDS_PASSWORD,
    // port: 3306,
    // database: "testdb",
    // uri: env.RDS_URL,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;
export const db = drizzle(conn, { schema, mode: "default" });
