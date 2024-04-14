import { z } from "zod";

import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  channels,
  conversations,
  directMessages,
  teams,
  users,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq, lt, sql } from "drizzle-orm";
// import { pusherServer } from "@/lib/pusher";
import { env } from "@/env.mjs";
import PusherServer from "pusher";

// cool (big {thing is happening})

export const pusherServer = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  useTLS: true,
  host: env.PUSHER_HOST,
  port: "443",
  cluster: "us2",
});

export const clientRouter = createTRPCRouter({
  createCoach: authedProcedure
    .input(
      z.object({
        name: z.string(),
        emailAddress: z.string(),
        teamName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values({
        name: input.name,
        emailAddress: input.emailAddress,
        clerkId: ctx.auth.userId,
      });
      const newUser = await ctx.db.query.users.findFirst({
        where: eq(users.emailAddress, input.emailAddress),
      });
      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "user not found after insert",
        });
      }

      await ctx.db.insert(teams).values({
        name: input.teamName,
        headCoach: newUser.id,
      });

      const newTeam = await ctx.db.query.teams.findFirst({
        where: eq(teams.headCoach, newUser.id),
      });

      if (!newTeam) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "team not found after insert",
        });
      }

      await ctx.db.insert(channels).values({
        name: "general",
        teamId: newTeam.id,
      });

      await ctx.db
        .update(users)
        .set({
          isCoach: true,
          teamId: newTeam.id,
        })
        .where(eq(users.id, newUser.id));

      return {
        publicUserId: newUser.publicId,
        publicTeamId: newTeam.publicId,
      };
    }),

  createAthlete: authedProcedure
    .input(
      z.object({
        name: z.string(),
        emailAddress: z.string(),
        publicUserId: z.string(),
        clerkId: z.string(),
        teamId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          emailAddress: input.emailAddress,
          name: input.name,
          clerkId: input.clerkId,
        })
        .where(eq(users.publicId, input.publicUserId));

      const headcoach = await ctx.db.query.teams.findFirst({
        where: eq(teams.id, input.teamId),
        columns: {
          headCoach: true,
        },
      });
      const newUser = await ctx.db.query.users.findFirst({
        where: eq(users.publicId, input.publicUserId),
      });

      if (!headcoach || !newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "user or team not found after insert",
        });
      }

      await ctx.db.insert(conversations).values({
        userId1: headcoach.headCoach,
        userId2: newUser.id,
      });
    }),
  getConversationMessages: authedProcedure
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.publicId, input.conversationId),
      });
      if (!conversation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "conversation not found",
        });
      }

      const messages = await db.query.directMessages.findMany({
        where: eq(directMessages.conversationId, conversation.id),
        orderBy: [asc(directMessages.createdAt)],
      });

      return messages;
    }),

  getInfiniteConversationMessages: authedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        limit: z.number().optional().default(10),
        cursor: z.date().optional(),
      }),
    )
    .query(async ({ input }) => {
      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.publicId, input.conversationId),
      });
      if (!conversation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "conversation not found",
        });
      }

      if (input.cursor) {
        const messages = await db.query.directMessages.findMany({
          where: lt(directMessages.createdAt, input.cursor),
          orderBy: [desc(directMessages.createdAt)],
          limit: input.limit + 1,
        });
        return {
          messages: messages.slice(0, input.limit),
          nextCursor: messages[messages.length - 1]?.createdAt,
        };
      } else {
        const messages = await db.query.directMessages.findMany({
          where: eq(directMessages.conversationId, conversation.id),
          orderBy: [desc(directMessages.createdAt)],
          limit: input.limit + 1,
        });

        return {
          messages: messages.slice(0, input.limit),
          nextCursor: messages[messages.length - 1]?.createdAt,
        };
      }
    }),

  sendMessage: authedProcedure
    .input(
      z.object({
        message: z.string().min(1),
        conversationPublicId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.publicId, input.conversationPublicId),
      });

      if (!conversation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "conversation not found",
        });
      }
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, ctx.user.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "user not found",
        });
      }
      const messageInsertResult = await db.insert(directMessages).values({
        content: input.message,
        conversationId: conversation.id,
        memberId: user.id,
        name: user.name,
      });

      if (!messageInsertResult) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "message not inserted",
        });
      }

      const messageId = messageInsertResult.insertId;
      if (!messageId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "message not inserted",
        });
      }
      const message = await db.query.directMessages.findFirst({
        where: eq(directMessages.id, +messageId),
      });

      await pusherServer.trigger(
        input.conversationPublicId,
        "new-message",
        message,
      );
    }),
});
