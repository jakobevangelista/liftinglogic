// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  mysqlTableCreator,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { customAlphabet } from "nanoid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `liftinglogic_${name}`);

export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: varchar("public_id", { length: 12 })
      .notNull()
      .$defaultFn(() => {
        const nanoid = customAlphabet(
          "0123456789abcdefghijklmnopqrstuvwxyz",
          12,
        );
        return nanoid();
      }),
    name: varchar("name", { length: 256 }).notNull(),

    emailAddress: varchar("email_address", { length: 256 }).notNull(),

    clerkId: varchar("clerk_id", { length: 256 }),

    isCoach: boolean("is_coach").notNull().default(false),

    teamId: bigint("team_id", { mode: "number" }),

    sheetUrl: varchar("sheet_url", { length: 256 }),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => ({
    nameIndex: index("name_idx").on(table.name),
    emailAddressIndex: index("email_address_idx").on(table.emailAddress),
    publicIdIndex: uniqueIndex("public_id_idx").on(table.publicId),
    clerkIdIndex: uniqueIndex("clerk_id_idx").on(table.clerkId),
    teamIdIndex: index("team_id_idx").on(table.teamId),
  }),
);

export const teams = mysqlTable(
  "teams",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: varchar("public_id", { length: 12 })
      .notNull()
      .$defaultFn(() => {
        const nanoid = customAlphabet(
          "0123456789abcdefghijklmnopqrstuvwxyz",
          12,
        );
        return nanoid();
      }),
    name: varchar("name", { length: 256 }).notNull(),

    headCoach: bigint("head_coach", {
      mode: "number",
    }).notNull(),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      name: uniqueIndex("name_idx").on(table.name),
      publicIdIndex: uniqueIndex("public_id_idx").on(table.publicId),
      headCoachIndex: uniqueIndex("head_coach_idx").on(table.headCoach),
    };
  },
);
