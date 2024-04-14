import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "./server/db";
import { eq } from "drizzle-orm";
import { users } from "./server/db/schema";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    // "/team/(.*)/onboarding/(.*)"
  ],
  afterAuth: (auth, req, evt) => {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const back = new URL("/sign-in", req.url);
      return NextResponse.redirect(back);
    }

    // if (!auth.isPublicRoute && auth.userId) {
    //   const user = await db.query.users.findFirst({
    //     where: eq(users.clerkId, auth.userId),
    //   });
    //   if (!user?.clerkId) {
    //     NextResponse.redirect("/onboarding");
    //   }
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
