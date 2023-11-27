import Link from "next/link";

import { Button } from "@/components/ui/button";
import ClientHeroSection from "@/components/landingPage/clientHero";
import { UserButton, currentUser } from "@clerk/nextjs";

const navigation = [{ name: "Home", href: "/", disabled: false }];

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
              <Link href="#" className="-m-1.5 p-1.5">
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
              </Link>
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
                  <UserButton afterSignOutUrl="/" />
                </Link>
              )}
            </div>
          </nav>
        </header>

        <div className="mx-auto -mt-16 flex max-w-xl justify-center ">
          <article className="prose w-full p-8 pt-24">
            <h1>PlusEv Solutions Terms of Service Agreement</h1>
            <p>TERMS OF SERVICE AGREEMENT</p>
            <p>
              This Terms of Service Agreement (&quot;Agreement&quot;) is entered
              into between PlusEv Solutions Inc. (&quot;PlusEv Solutions&quot;),
              a company incorporated under the laws of the state of Delaware,
              and the user (&quot;User&quot;) who intends to use the services
              offered by PlusEv Solutions. By accessing or using PlusEv
              Solutions&apos; services, User acknowledges that they have read,
              understood, and agree to be bound by the terms and conditions of
              this Agreement. If User does not agree to these terms, User may
              not use the services offered by PlusEv Solutions.
            </p>
            <ol>
              <li>
                Definitions
                <ol>
                  <li>
                    &quot;Services&quot; refers to the web application services
                    offered by PlusEv Solutions.
                  </li>
                  <li>
                    &quot;User Content&quot; refers to any files, data,
                    information, or other content uploaded or transmitted by
                    User through the Services.
                  </li>
                </ol>
              </li>
              <li>
                Use of Services
                <ol>
                  <li>
                    User agrees to use the Services solely for lawful purposes
                    and in compliance with all applicable laws and regulations.
                  </li>
                  <li>
                    User agrees not to upload or transmit any User Content that
                    is infringing, libelous, defamatory, obscene, pornographic,
                    abusive, or otherwise offensive.
                  </li>
                  <li>
                    User agrees not to use the Services in a manner that would
                    violate the intellectual property rights of any third party.
                  </li>
                  <li>
                    User acknowledges and agrees that PlusEv Solutions has no
                    control over the content of User Content and does not
                    endorse, support, or guarantee the accuracy, completeness,
                    or reliability of User Content.
                  </li>
                </ol>
              </li>
              <li>
                User Data Ownership
                <ol>
                  <li>
                    User retains all ownership rights in any data, files, or
                    other content (&quot;User Content&quot;) uploaded or stored
                    on the Services.
                  </li>
                  <li>
                    PlusEv Solutions does not own or claim any rights to User
                    Content and will not use, modify, or disclose User Content
                    except as necessary to provide the Services or as required
                    by law.
                  </li>
                  <li>
                    User is solely responsible for ensuring that User Content
                    does not infringe any third-party intellectual property
                    rights or violate any applicable laws or regulations.
                  </li>
                </ol>
              </li>
              <li>
                Fees and Payment
                <ol>
                  <li>
                    PlusEv Solutions reserves the right to charge fees for the
                    use of its Services.
                  </li>
                  <li>
                    User agrees to pay all fees and charges incurred in
                    connection with the use of the Services in a timely manner.
                  </li>
                  <li>
                    PlusEv Solutions reserves the right to modify its fees and
                    payment policies at any time, with notice to User.
                  </li>
                </ol>
              </li>
              <li>
                Disclaimer of Warranties
                <ol>
                  <li>
                    PlusEv Solutions provides its Services on an &quot;as
                    is&quot; and &quot;as available&quot; basis.
                  </li>
                  <li>
                    PlusEv Solutions does not warrant that the Services will
                    meet User&apos;s requirements, be error-free, uninterrupted,
                    or secure.
                  </li>
                  <li>
                    PlusEv Solutions disclaims all warranties, whether express
                    or implied, including but not limited to, warranties of
                    merchantability, fitness for a particular purpose, and
                    non-infringement.
                  </li>
                </ol>
              </li>
              <li>
                Limitation of Liability
                <ol>
                  <li>
                    PlusEv Solutions shall not be liable for any damages arising
                    from the use of, inability to use, or reliance on the
                    Services, including but not limited to, direct, indirect,
                    incidental, special, or consequential damages.
                  </li>
                  <li>
                    PlusEv Solutions&apos; liability for any claim arising out
                    of or relating to this Agreement shall not exceed the amount
                    paid by User to PlusEv Solutions for the Services.
                  </li>
                  <li>
                    PlusEv Solutions shall not be liable for any damages arising
                    from the unauthorized access to or use of User Content.
                  </li>
                </ol>
              </li>
              <li>
                Indemnification
                <ol>
                  <li>
                    User agrees to indemnify, defend, and hold harmless PlusEv
                    Solutions and its officers.
                  </li>
                  <li>
                    User agrees to indemnify, defend, and hold harmless PlusEv
                    Solutions and its officers, directors, employees, agents,
                    and affiliates from and against any and all claims, damages,
                    liabilities, costs, and expenses, including reasonable
                    attorneys&apos; fees, arising from or related to User&apos;s
                    use of the Services, User Content, or User&apos;s breach of
                    this Agreement.
                  </li>
                </ol>
              </li>
              <li>
                Termination
                <ol>
                  <li>
                    PlusEv Solutions may terminate this Agreement and
                    User&apos;s access to the Services at any time, with or
                    without cause, by providing notice to User.
                  </li>
                  <li>
                    Upon termination, User&apos;s access to the Services will be
                    immediately terminated and all User Content will be deleted.
                  </li>
                  <li>
                    The provisions of Sections 3, 5, 6, 7, and 9 of this
                    Agreement shall survive any termination.
                  </li>
                </ol>
              </li>
              <li>
                Governing Law and Jurisdiction
                <ol>
                  <li>
                    This Agreement shall be governed by and construed in
                    accordance with the laws of the state of Delaware, without
                    giving effect to any choice of law or conflict of law
                    provisions.
                  </li>
                  <li>
                    Any dispute arisin g out of or relating to this Agreement
                    shall be resolved exclusively in the state and federal
                    courts located in Delaware.
                  </li>
                </ol>
              </li>
              <li>
                Miscellaneous
                <ol>
                  <li>
                    This Agreement constitutes the entire agreement between T3
                    Tools and User regarding the Services and supersedes all
                    prior agreements and understandings, whether written or
                    oral.
                  </li>
                  <li>
                    PlusEv Solutions may assign this Agreement or any of its
                    rights or obligations hereunder without User&apos;s prior
                    consent.
                  </li>
                  <li>
                    User may not assign this Agreement or any of its rights or
                    obligations hereunder without the prior written consent of
                    PlusEv Solutions.
                  </li>
                  <li>
                    The failure of either party to enforce any provision of this
                    Agreement shall not be deemed a waiver of such provision or
                    the right to enforce such provision.
                  </li>
                  <li>
                    If any provision of this Agreement is held to be invalid or
                    unenforceable, the remaining provisions shall remain in full
                    force and effect.
                  </li>
                </ol>
              </li>
            </ol>
            <p>
              By using the Services, User agrees to be bound by the terms and
              conditions of this Agreement. If User does not agree to these
              terms, User may not use the Services offered by PlusEv Solutions.
            </p>
          </article>
        </div>
      </div>
    </>
  );
};

export default Hero;
