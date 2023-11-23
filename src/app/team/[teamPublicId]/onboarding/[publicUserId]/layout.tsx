import OnboardingNavClient from "@/components/navbar/onboarding/onboardingNavClient";
import { cn } from "@/lib/utils";
import { RedirectToSignUp, UserButton, currentUser } from "@clerk/nextjs";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Register", href: "#", icon: DocumentDuplicateIcon, current: true },
];

interface OnboardinLayoutProps {
  children: React.ReactNode;
  params: {
    teamPublicId: string;
    publicUserId: string;
  };
}

export default async function OnboardingLayout({
  children,
  params,
}: OnboardinLayoutProps) {
  const user = await currentUser();
  if (!user) {
    return (
      <RedirectToSignUp
        afterSignInUrl={`/team/${params.teamPublicId}/onboarding/${params.publicUserId}`}
      />
    );
  }
  return (
    <>
      <div>
        <OnboardingNavClient />
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <span className="font-bold hover:cursor-pointer">
                lifting<span className="text-primary">logic</span>
              </span>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={cn(
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="-mx-6 mt-auto">
                  <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white ">
                    <UserButton afterSignOutUrl="/" />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">
                      {user.firstName}
                      {user.lastName}
                    </span>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className="py-10 lg:pl-72">
          <div className=" px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
