"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, useState } from "react";

import { Hash } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import InviteModal from "../modals/invite-modal";

interface TeamNavBarClientProps {
  channels: {
    id: number;
    name: string;
    publicId: string;
    teamId: number;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
  userConversations: {
    users: {
      id: number;
      name: string;
      publicId: string;
      emailAddress: string;
      clerkId: string | null;
      isCoach: boolean;
      teamId: number | null;
      sheetUrl: string | null;
      createdAt: Date;
      updatedAt: Date | null;
    };
    conversations: {
      id: number;
      publicId: string;
      createdAt: Date;
      updatedAt: Date | null;
      userId1: number;
      userId2: number;
    };
  }[];
  user: {
    isCoach: boolean;
  };
  team: {
    name: string;
  };
}
const TeamNavBarClient = ({
  channels,
  userConversations,
  user,
  team,
}: TeamNavBarClientProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const navigation = channels.map((item) => {
    const isActive = params.channelId === item.publicId;

    return {
      name: item.name,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      href: `/team/${params.teamPublicId}/channels/${item.publicId}`,
      icon: Hash,
      current: isActive,
    };
  });
  const formattedConversations = userConversations.map((conversation) => {
    const isActive =
      params.conversationId === conversation.conversations.publicId;
    return {
      id: conversation.conversations.id,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      href: `/team/${params.teamPublicId}/conversations/${conversation.conversations.publicId}`,
      initial: conversation.users.name[0],
      name: conversation.users.name,
      current: isActive,
    };
  });
  console.log(channels.find((item) => item.publicId === params.channelId));
  console.log(channels);
  console.log(params.conversationId);
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                {/* <div className="bg-grey-900 flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2"> */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <span className="font-bold hover:cursor-pointer">
                      lifting<span className="text-primary">logic</span>
                    </span>
                  </div>
                  {user.isCoach ? (
                    <>
                      <div>{team.name} - Coach</div>
                      <InviteModal />
                    </>
                  ) : (
                    <div>{team.name} - Athlete</div>
                  )}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul
                          role="list"
                          className="-mx-2 space-y-1"
                          onClick={() => {
                            setSidebarOpen(false);
                          }}
                        >
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={cn(
                                  item.current
                                    ? "bg-gray-800 "
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    item.current
                                      ? "text-white"
                                      : "text-gray-400 group-hover:text-white",
                                    "h-6 w-6 shrink-0",
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">
                          Conversations
                        </div>
                        <ul
                          role="list"
                          className="-mx-2 mt-2 space-y-1"
                          onClick={() => {
                            setSidebarOpen(false);
                          }}
                        >
                          {formattedConversations.map((conversation) => (
                            <li key={conversation.id}>
                              <Link
                                href={conversation.href}
                                className={cn(
                                  conversation.current
                                    ? "bg-gray-800 text-primary"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-primary",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                )}
                              >
                                <span
                                  className={cn(
                                    conversation.current
                                      ? "border-primary text-primary"
                                      : "border-gray-200 text-primary group-hover:border-primary group-hover:text-primary",
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                                  )}
                                >
                                  {conversation.initial}
                                </span>
                                <span className="truncate">
                                  {conversation.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="bg-grey-900 sticky top-0 z-40 flex items-center gap-x-6 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          {pathname.includes("channels") && (
            <span>
              Channel: {navigation.find((item) => item.current === true)?.name}
            </span>
          )}
          {pathname.includes("conversation") && (
            <span>
              Conversation:{" "}
              {
                userConversations.find(
                  (item) =>
                    item.conversations.publicId === params.conversationId,
                )?.users.name
              }
            </span>
          )}
        </div>
        <Link href="#">
          <span className="sr-only">Your profile</span>
          <UserButton afterSignOutUrl="/" />
        </Link>
      </div>
    </>
  );
};

export default TeamNavBarClient;
