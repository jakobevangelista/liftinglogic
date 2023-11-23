import { CoachOnboardingForm } from "@/components/form/CoachOnboardingForm";
import { Separator } from "@/components/ui/separator";
import { checkOnboardingAuth } from "@/lib/checkAuth";

const Onboarding = async () => {
  const user = await checkOnboardingAuth();
  return (
    <>
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h3 className="text-lg font-medium">Welcome Coach!</h3>
          <p className="text-sm text-muted-foreground">
            Create your profile to get started.
          </p>
          <span className="font-black">
            IF YOU ARE AN ATHLETE, DO NOT FILL OUT THIS FORM ASK YOUR COACH TO
            SEND YOU AN INVITE LINK
          </span>
        </div>
        <Separator />
        <CoachOnboardingForm
          firstName={`${user.firstName}`}
          lastName={`${user.lastName}`}
          email={user.emailAddresses[0]?.emailAddress}
        />
      </div>
    </>
  );
};

export default Onboarding;
