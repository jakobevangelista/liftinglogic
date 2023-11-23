import { cn } from "@/lib/utils";
import { CheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "/sign-in",
    price: { perUser: "$0" },
    description: "Perfect for emerging coaches and small teams",
    features: [
      "0-10 clients",
      "1 coach",
      "Real time communication",
      "Payment tracking",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/sign-in",
    price: { perUser: "$1" },
    description: "A plan that scales with your rapidly growing team",
    features: [
      "Everything in Starter, plus:",
      "Up to 100 clients",
      "Up to 10 coaches",
      "Advanced analytics",
      "Custom client onboarding form",
      "AI powered programming (coming soon)",
    ],
    mostPopular: true,
  },
  {
    name: "Elite",
    id: "tier-elite",
    href: "https://cal.com/jakobevangelista/30min",
    price: { perUser: "Custom" },
    description:
      "Dedicated support and infrastructure for large teams and organizations",
    features: [
      "Everything in Pro, plus:",
      "Unlimited clients",
      "Unlimited coaches",
      "Custom analytics",
      "Custom reporting tools and automations",
      "1-hour, dedicated support response time",
    ],
    mostPopular: false,
  },
];

export default function Pricing() {
  return (
    <div id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Pricing plans for everybody
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          Start for free, pay when you need more
        </p>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                tier.mostPopular
                  ? "bg-white/5 ring-2 ring-primary"
                  : "ring-1 ring-white/10",
                "rounded-3xl p-8 xl:p-10",
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className="text-lg font-semibold leading-8 text-white"
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {tier.price.perUser}
                </span>
                {tier.name !== "Elite" ? (
                  <span className="text-sm font-semibold leading-6 text-gray-300">
                    / per client
                  </span>
                ) : null}
              </p>
              {tier.name !== "Elite" ? (
                <Link
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={cn(
                    tier.mostPopular
                      ? "bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:outline-primary"
                      : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                    "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  )}
                >
                  Get Started
                </Link>
              ) : (
                <Link
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={cn(
                    tier.mostPopular
                      ? "bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:outline-primary"
                      : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                    "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  )}
                >
                  Contact Us
                </Link>
              )}
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-white"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
