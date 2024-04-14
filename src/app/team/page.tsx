import { checkOnboardingAuth, checkSignedin } from "@/lib/checkAuth";
import { redirect } from "next/navigation";

const TeamPage = async () => {
  await checkOnboardingAuth();
  return redirect("/onboarding");
};

export default TeamPage;
