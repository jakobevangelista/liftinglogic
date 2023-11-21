import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { authMiddleware } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/", "/api(.*)", "/sign-in"],
  afterAuth: async (auth, req) => {
    // // handle users who aren't authenticated
    // if (!auth.userId && !auth.isPublicRoute) {
    //   const back = new URL("/sign-in", req.url);
    //   return NextResponse.redirect(back);
    // }
    // if (auth.userId && auth.isPublicRoute) {
    //   const user = await db.query.users.findFirst({
    //     where: eq(users.userId, auth.userId),
    //   });
    //   if (!user) {
    //     const back = new URL("/onboarding", req.url);
    //     return NextResponse.redirect(back);
    //   }
    //   // const coachesList = await db
    //   //   .select()
    //   //   .from(users)
    //   //   .innerJoin(users, eq(users.id, coaches.userId));
    //   // if (coachesList) console.log(coachesList);
    // }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  // matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/"],
};
