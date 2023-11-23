import { createTRPCRouter } from "@/server/api/trpc";
import { coachRouter } from "./routers/coachRoutes";
import { clientRouter } from "./routers/clientRoutes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  coach: coachRouter,
  client: clientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
