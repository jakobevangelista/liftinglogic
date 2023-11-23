import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const checkSignedin = async () => {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  return user;
};

export const checkOnboardingAuth = async () => {
  const user = await checkSignedin();
  const isRegistered = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (isRegistered !== undefined) {
    if (isRegistered.teamId !== null) {
      const team = await db.query.teams.findFirst({
        where: eq(teams.id, isRegistered.teamId),
      });
      redirect(`/team/${team?.publicId}`);
    }
  }

  return user;
};

export const checkTeamOnboardingAuth = async (
  teamId: string,
  userId: string,
) => {
  const user = await checkSignedin();
  const isRegistered = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });
  const team = await db.query.teams.findFirst({
    where: eq(teams.publicId, teamId),
  });

  if (isRegistered?.teamId === team?.id && isRegistered?.publicId === userId) {
    redirect("/onboarding");
  }

  return { isRegistered, team, user };
};
