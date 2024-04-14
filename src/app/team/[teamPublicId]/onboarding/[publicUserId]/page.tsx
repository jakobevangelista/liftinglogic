import { AthleteOnboardingForm } from "@/components/form/AthleteOnboardingForm";
import { Separator } from "@/components/ui/separator";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { RedirectToSignUp, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface TeamOnboardingProps {
  params: {
    teamPublicId: string;
    publicUserId: string;
  };
}
const TeamOnboarding = async ({ params }: TeamOnboardingProps) => {
  const user = await currentUser();
  const team = await db.query.teams.findFirst({
    where: eq(teams.publicId, params.teamPublicId),
  });
  if (!user) {
    return (
      <RedirectToSignUp
        afterSignInUrl={`/team/${params.teamPublicId}/onboarding/${params.publicUserId}`}
      />
    );
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.publicId, params.publicUserId),
  });

  if (existingUser?.teamId !== team?.id || !team) {
    redirect("/onboarding");
  }

  if (existingUser?.teamId === team?.id && existingUser?.clerkId === user.id) {
    redirect(`/team/${params.teamPublicId}`);
  }

  return (
    <>
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h3 className="text-lg font-medium">
            Welcome to {team?.name} {existingUser?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your profile to get started.
          </p>
        </div>
        <Separator />
        <AthleteOnboardingForm
          teamPublicId={params.teamPublicId}
          publicUserId={params.publicUserId}
          email={user.emailAddresses[0]?.emailAddress}
          name={existingUser?.name}
          clerkId={user.id}
          team={team}
        />
      </div>
    </>
  );
};

export default TeamOnboarding;
