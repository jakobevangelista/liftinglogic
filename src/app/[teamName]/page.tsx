import { checkIfUserSignedInAndRegistered } from "@/lib/checkAuth";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface DashboardProps {
  params: {
    teamName: string;
  };
}

const Dashboard = async ({ params }: DashboardProps) => {
  await checkIfUserSignedInAndRegistered();
  const team = await db.query.teams.findFirst({
    where: eq(teams.name, params.teamName),
  });

  if (!team) {
    redirect(`/onboarding`);
  }

  const userInTeam = await db.query.users.findFirst({
    where: eq(users.teamId, team.id),
  });

  if (!userInTeam) {
    redirect(`/onboarding`);
  }

  return (
    <>
      <div>Dashboard {params.teamName}</div>
    </>
  );
};

export default Dashboard;
