import TeamNavbar from "@/components/teamNavbar/TeamNavbar";
import { checkSignedin } from "@/lib/checkAuth";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface DashboardProps {
  params: {
    teamPublicId: string;
    // channelId?: string;
    // conversationsId?: string;
  };
  children: React.ReactNode;
}

const Dashboard = async ({ params, children }: DashboardProps) => {
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

  return (
    <>
      <div>
        <TeamNavbar user={isPartOfTeam} params={params} />

        {/* <main className="h-screen flex-col justify-end py-10 lg:pl-72"> */}
        <main className="flex h-screen p-4 lg:pl-72">
          {/* <div className=" px-4 sm:px-6 lg:px-8">{children}</div> */}
          {children}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
