import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const checkIfUserSignedInAndRegistered = async () => {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const isRegistered = await db.query.users.findFirst({
    where: eq(users.userId, user.id),
  });

  if (!isRegistered) {
    redirect("/onboarding");
  }

  return isRegistered;
};

export const checkIfUserSignedIn = async () => {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  return user;
};
