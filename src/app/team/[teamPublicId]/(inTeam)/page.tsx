import { checkSignedin } from "@/lib/checkAuth";
import { db } from "@/server/db";
import { channels, teams, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface DashboardProps {
  params: {
    teamPublicId: string;
  };
}

const Dashboard = async ({ params }: DashboardProps) => {
  const user = await checkSignedin();
  const isPartOfTeam = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });
  const team = await db.query.teams.findFirst({
    where: eq(teams.publicId, params.teamPublicId),
  });
  if (
    (isPartOfTeam?.teamId !== team?.id && isPartOfTeam !== undefined) ||
    !isPartOfTeam
  ) {
    redirect("/onboarding");
  }

  if (isPartOfTeam?.teamId === team?.id && isPartOfTeam?.clerkId === null) {
    redirect(
      `/team/${params.teamPublicId}/onboarding/${isPartOfTeam?.publicId}`,
    );
  }
  const channelsInTeam = await db
    .select({ publicId: channels.publicId })
    .from(channels)
    .innerJoin(teams, eq(channels.teamId, teams.id));

  // return <div>{channelsInTeam[0]?.publicId}</div>;

  return redirect(
    `/team/${params.teamPublicId}/channels/${channelsInTeam[0]?.publicId}`,
  );
};

export default Dashboard;
