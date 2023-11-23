import Link from "next/link";

import { Button } from "../ui/button";
import ClientHeroSection from "./clientHero";
import { UserButton, currentUser } from "@clerk/nextjs";

const navigation = [{ name: "Pricing", href: "#pricing", disabled: false }];

const Hero = async () => {
  const user = await currentUser();
  return (
    <>
      <div>
        <header className="sticky top-0 z-50 w-full ">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <h1 className="relative flex flex-row items-baseline text-2xl font-bold">
                  <span className="sr-only">liftinglogic</span>
                  <span className="tracking-tight hover:cursor-pointer">
                    lifting<span className="text-primary">logic</span>
                  </span>
                  <sup className="absolute left-[calc(100%+.1rem)] top-0 text-xs font-bold text-white">
                    [BETA]
                  </sup>
                </h1>
              </a>
            </div>
            <div className="flex lg:hidden">
              <ClientHeroSection />
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-semibold leading-6  ${
                    item.disabled ? "cursor-not-allowed opacity-50" : null
                  }`}
                  aria-disabled={item.disabled}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden items-center gap-x-6 lg:flex lg:flex-1 lg:justify-end">
              {user === null ? (
                <Button asChild>
                  <Link
                    href="/sign-in"
                    className="text-sm font-semibold leading-6 "
                  >
                    Log in <span aria-hidden="true">&rarr;</span>
                  </Link>
                </Button>
              ) : (
                <Link
                  href="/onboarding"
                  className="flex cursor-pointer flex-row items-center gap-4 text-sm font-semibold leading-6"
                >
                  Go To Team
                  <UserButton />
                </Link>
              )}
            </div>
          </nav>
        </header>

        <div className="relative isolate mt-16 px-6 pt-14 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1d4ed8] to-[#93c5fd] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Streamline Your Coaching, Maximize Result
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Empowering coaches with intuitive tools to help them manage
                their team
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild>
                  <Link href="/sign-in">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1d4ed8] to-[#93c5fd] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
