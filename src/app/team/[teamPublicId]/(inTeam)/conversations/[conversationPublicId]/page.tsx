import DirectMessageInput from "@/components/directMessages/DirectMessageInput";
import DirectMessages from "@/components/directMessages/DirectMessages";
import { Label } from "@/components/ui/label";
import { checkSignedin } from "@/lib/checkAuth";
import { db } from "@/server/db";
import { conversations, directMessages, users } from "@/server/db/schema";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { asc, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface ConversationProps {
  params: {
    teamPublicId: string;
    conversationPublicId: string;
  };
}

const ConversationPage = async ({ params }: ConversationProps) => {
  const queryClient = new QueryClient();
  const user = await checkSignedin();

  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.publicId, params.conversationPublicId),
  });
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });
  if (!dbUser) {
    redirect("/sign-in");
  }

  if (!conversation) {
    redirect(`/team/${params.teamPublicId}`);
  }

  const currentUserId =
    dbUser.id === conversation.userId1 ? dbUser.id : conversation.userId2;

  const otherUser =
    dbUser.id === conversation.userId1 ? conversation.userId2 : dbUser.id;
  const otherDbUser = await db.query.users.findFirst({
    where: eq(users.id, otherUser),
  });
  if (!otherDbUser) {
    redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: [
      ["client", "getInfiniteConversationMessages"],
      {
        input: {
          conversationId: `${params.conversationPublicId}`,
          limit: 5,
        },
        type: "infinite",
      },
    ],
    queryFn: async () => {
      const messages = await db.query.directMessages.findMany({
        where: eq(directMessages.conversationId, conversation.id),
        orderBy: [desc(directMessages.createdAt)],
        limit: 6,
      });

      return {
        pages: [
          {
            messages: messages.slice(0, messages.length - 1),
            nextCursor: messages[messages.length - 1]?.createdAt,
          },
        ],
        pageParams: [],
      };
    },
  });

  return (
    <>
      <div className="flex w-full flex-col px-4 pt-1 sm:px-6 lg:px-8">
        <div className="mb-10 hidden lg:flex lg:justify-start">
          <Label className="flext w-full px-4">{otherDbUser.name}</Label>
        </div>
        <div className="mt-auto flex h-full w-full flex-col justify-end">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <DirectMessages
              conversationPublicId={params.conversationPublicId}
              currentUser={currentUserId}
            />
          </HydrationBoundary>
          <DirectMessageInput
            conversationPublicId={params.conversationPublicId}
          />
        </div>
      </div>
    </>
  );
};

export default ConversationPage;
