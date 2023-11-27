"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ChannelListProps {
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
}
const ConversationList = ({ userConversations }: ChannelListProps) => {
  const params = useParams();

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
  return (
    <>
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
            <span className="truncate">{conversation.name}</span>
          </Link>
        </li>
      ))}
    </>
  );
};

export default ConversationList;
