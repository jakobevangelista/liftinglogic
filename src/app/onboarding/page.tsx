import { checkIfUserSignedIn } from "@/lib/checkAuth";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/form/OnboardingForm";

const Onboarding = async () => {
  const user = await checkIfUserSignedIn();

  return (
    <>
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h3 className="text-lg font-medium">Create Profile</h3>
          <p className="text-sm text-muted-foreground">
            Create your profile to get started.
          </p>
        </div>
        <Separator />
        <ProfileForm
          firstName={`${user.firstName}`}
          lastName={`${user.lastName}`}
          userId={user.id}
          email={user.emailAddresses[0]?.emailAddress}
        />
      </div>
    </>
  );
};

export default Onboarding;
