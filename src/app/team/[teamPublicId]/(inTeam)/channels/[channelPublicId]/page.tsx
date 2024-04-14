import { Button } from "@/components/ui/button";
import { checkSignedin } from "@/lib/checkAuth";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface ChannelProps {
  params: {
    teamPublicId: string;
    channelPublicId: string;
  };
}

const Channel = async ({ params }: ChannelProps) => {
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

  const channel = await db.query.channels.findFirst({
    where: eq(teams.publicId, params.channelPublicId),
  });

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
      <div>Channel: {channel?.name}</div>
      <div>
        <form>
          <Button formAction={handleButtonClick}>deeznuts</Button>
        </form>
      </div>
    </>
  );
};

export default Channel;



   // i want to put everything in paren.