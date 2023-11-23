/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

// eslint-disable-next-line @typescript-eslint/require-await
export const createTRPCContext = async (opts: { headers: Headers }) => {
  // Fetch stuff that depends on the request

  return {
    db,
    auth: auth(),
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

const enforcedUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      user: { ...ctx.auth, user: ctx.auth.userId },
    },
  });
});

export const authedProcedure = t.procedure.use(enforcedUserIsAuthed);

const enforcedUserIsTeamCoach = t.middleware(async ({ ctx, next, input }) => {
  console.log("deeznuts:", ctx.auth.userId);

  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "user not found" });
  }

  const user = await ctx.db.query.users.findFirst({
    where: eq(users.clerkId, ctx.auth.userId),
  });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user not found, need to onboard",
    });
  }

  const typedInput = input as { teamId: number };

  const teamId = typedInput.teamId;

  if (!teamId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "teamId not provided",
    });
  }

  const coach = await ctx.db.query.users.findFirst({
    where: and(eq(users.clerkId, ctx.auth.userId), eq(users.teamId, teamId)),
  });

  if (!coach) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user is not a coach of this team",
    });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      user: { ...ctx.auth, user: ctx.auth.userId },
    },
  });
});
export const coachProcedure = t.procedure.use(enforcedUserIsTeamCoach);
