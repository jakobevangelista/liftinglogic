import { z } from "zod";

import {
  authedProcedure,
  coachProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { channels, conversations, teams, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

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
});
