// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  mysqlTableCreator,
  serial,
  text,
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
    id: serial("id").primaryKey(),
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

    createdAt: timestamp("created_at").defaultNow().notNull(),
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

export const userRelations = relations(users, ({ one, many }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
  messages: many(messages),
  directMessages: many(directMessages),
}));

export const teams = mysqlTable(
  "teams",
  {
    id: serial("id").primaryKey(),
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

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      name: index("name_idx").on(table.name),
      publicIdIndex: uniqueIndex("public_id_idx").on(table.publicId),
      headCoachIndex: index("head_coach_idx").on(table.headCoach),
    };
  },
);

export const teamsRelations = relations(teams, ({ many }) => ({
  channels: many(channels),
  users: many(users),
}));

export const channels = mysqlTable(
  "channels",
  {
    id: serial("id").primaryKey(),
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

    teamId: bigint("head_coach", {
      mode: "number",
    }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      name: index("name_idx").on(table.name),
      publicIdIndex: uniqueIndex("public_id_idx").on(table.publicId),
      teamIdIndex: index("team_id_idx").on(table.teamId),
    };
  },
);

export const channelsRelations = relations(channels, ({ one, many }) => ({
  team: one(teams, {
    fields: [channels.teamId],
    references: [teams.id],
  }),
  messages: many(messages),
}));

export const messages = mysqlTable(
  "messages",
  {
    id: serial("id").primaryKey(),

    content: text("content").notNull(),

    fileUrl: varchar("file_url", { length: 256 }),

    channelId: bigint("channel_id", {
      mode: "number",
    }).notNull(),

    memberId: bigint("member_id", {
      mode: "number",
    }).notNull(),

    name: varchar("name", { length: 256 }).notNull(),

    deleted: boolean("deleted").notNull().default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      memberIdIndex: index("member_id_idx").on(table.memberId),
      channelIdIndex: index("channel_id_idx").on(table.channelId),
    };
  },
);

export const messagesRelations = relations(messages, ({ one }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
  user: one(users, {
    fields: [messages.memberId],
    references: [users.id],
  }),
}));

export const conversations = mysqlTable(
  "conversations",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 12 })
      .notNull()
      .$defaultFn(() => {
        const nanoid = customAlphabet(
          "0123456789abcdefghijklmnopqrstuvwxyz",
          12,
        );
        return nanoid();
      }),
    userId1: bigint("user_id_1", { mode: "number" }).notNull(),
    userId2: bigint("user_id_2", { mode: "number" }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      userId1Index: index("user_id1_idx").on(table.userId1),
      userId2Index: index("user_id2_idx").on(table.userId2),
      publicIdIndex: uniqueIndex("public_id_idx").on(table.publicId),
    };
  },
);

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(directMessages),
}));

export const directMessages = mysqlTable(
  "direct_messages",
  {
    id: serial("id").primaryKey(),

    content: text("content").notNull(),

    fileUrl: varchar("file_url", { length: 256 }),

    conversationId: bigint("channel_id", {
      mode: "number",
    }).notNull(),

    memberId: bigint("member_id", {
      mode: "number",
    }).notNull(),

    name: varchar("name", { length: 256 }).notNull(),

    deleted: boolean("deleted").notNull().default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      memberIdIndex: index("member_id_idx").on(table.memberId),
      conversationIdIndex: index("conversation_id_idx").on(
        table.conversationId,
      ),
    };
  },
);
export const directMessagesRelations = relations(directMessages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [directMessages.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [directMessages.memberId],
    references: [users.id],
  }),
}));
