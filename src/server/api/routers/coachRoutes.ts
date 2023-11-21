import { z } from "zod";

import { coachProcedure, createTRPCRouter } from "@/server/api/trpc";

export const coachRouter = createTRPCRouter({
  hello: coachProcedure
    .input(z.object({ text: z.string(), teamId: z.number() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
