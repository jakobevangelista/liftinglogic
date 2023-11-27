import { cn } from "@/lib/utils";
import { db } from "@/server/db";
import { conversations, teams, users } from "@/server/db/schema";
import { UserButton } from "@clerk/nextjs";
import { eq, ne, or } from "drizzle-orm";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import InviteModal from "../modals/invite-modal";
import ChannelList from "./ChannelList";
import ConversationList from "./ConversationList";
import TeamNavBarClient from "./TeamNavBarClient";

interface DashboardProps {
  user: { id: number; name: string; isCoach: boolean };
  params: {
    teamPublicId: string;
    channelId?: string;
    conversationsId?: string;
  };
}

const TeamNavbar = async ({ user, params }: DashboardProps) => {
  const team = await db.query.teams.findFirst({
    where: eq(teams.publicId, params.teamPublicId),
    with: {
      channels: true,
    },
  });

  const userConversations = await db
    .select()
    .from(conversations)
    .innerJoin(
      users,
      or(
        eq(conversations.userId1, user.id),
        eq(conversations.userId2, user.id),
      ),
    )
    .where(ne(users.id, user.id));

  if (!team) {
    return redirect("/team");
  }

  return (
    <>
      <TeamNavBarClient
        channels={team.channels}
        userConversations={userConversations}
        user={user}
        team={team}
      />
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <span className="font-bold hover:cursor-pointer">
              lifting<span className="text-primary">logic</span>
            </span>
          </div>
          {user.isCoach ? (
            <>
              <div className="-mx-2">{team.name} - Coach</div>
              <div className="-mx-2 mr-auto">
                <InviteModal />
              </div>
              <Link
                href="/dashboard"
                className={cn(
                  // item.current
                  //   ? "bg-gray-800 text-white"
                  "-mx-2 text-gray-400 hover:bg-gray-800 hover:text-white",
                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                )}
              >
                <HomeIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                Team Dashboard
              </Link>
            </>
          ) : (
            <div>{team.name} - Athlete</div>
          )}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Team Channels
                </div>
                <ul role="list" className="-mx-2 space-y-1">
                  <ChannelList channels={team.channels} />
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Conversations
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  <ConversationList userConversations={userConversations} />
                </ul>
              </li>

              <li className="-mx-6 mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white ">
                  <UserButton afterSignOutUrl="/" />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{user.name}</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default TeamNavbar;
