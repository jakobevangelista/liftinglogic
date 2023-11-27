import { Button } from "@/components/ui/button";
import { checkSignedin } from "@/lib/checkAuth";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface DashboardProps {
  params: {
    teamPublicId: string;
    channelId: string;
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
  console.log(isPartOfTeam);

  const handleButtonClick = async () => {
    "use server";
    await db.insert(users).values({
      emailAddress: "jakobevanglista@gmail.com",
      name: "Jakob Evanglista",
      teamId: team?.id,
    });
  };

  return (
    <>
      <div>Dashboard {team?.name}</div>
      <div>
        <form>
          <Button formAction={handleButtonClick}>deeznuts</Button>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
