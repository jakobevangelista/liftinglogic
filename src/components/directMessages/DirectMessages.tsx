"use client";

import { api } from "@/trpc/react";

import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

interface DirectMessagesProps {
  conversationPublicId: string;
  currentUser: number;
}

interface PusherChannelNewMessageType {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  content: string;
  fileUrl: string | null;
  memberId: number;
  deleted: boolean;
  conversationId: number;
}

function DirectMessages({
  conversationPublicId,
  currentUser,
}: DirectMessagesProps) {
  const queryClient = useQueryClient();

  const queryKey = getQueryKey(
    api.clientRouter.getInfiniteConversationMessages,
    undefined,
    "infinite",
  );
  const infiniteMessages =
    api.clientRouter.getInfiniteConversationMessages.useInfiniteQuery(
      {
        conversationId: conversationPublicId,
        limit: 5,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      },
    );

  useEffect(() => {
    pusherClient.subscribe(conversationPublicId);

    pusherClient.bind(
      "new-message",
      async (message: PusherChannelNewMessageType) => {
        queryClient.setQueryData(
          queryKey,
          (oldData: typeof infiniteMessages) => {
            if (!oldData) {
              return;
            }

            const newData = {
              ...oldData,
              pages: [
                {
                  messages: [message, ...oldData.data!.pages[0]!.messages],
                },
                ...oldData.data!.pages.slice(1),
              ],
            };
            return newData;
          },
        );

        await queryClient.invalidateQueries({
          queryKey,
        });
      },
    );

    return () => {
      pusherClient.unsubscribe(conversationPublicId);
    };
  }, [conversationPublicId, queryClient, queryKey]);

  return (
    <>
      <div className="mt-auto overflow-y-scroll">
        <ul>
          {infiniteMessages.hasNextPage ? (
            <button
              onClick={async () => {
                await infiniteMessages.fetchNextPage();
              }}
            >
              Load More
            </button>
          ) : null}
          <div className="flex flex-col-reverse">
            {infiniteMessages.data
              ? infiniteMessages.data.pages.map((infMsg) => (
                  <>
                    {infMsg.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex w-full flex-col rounded-md p-4 hover:bg-gray-900 hover:text-white",
                          currentUser === msg.memberId
                            ? null
                            : "bg-background/50",
                        )}
                      >
                        <Label
                          className={cn(
                            "mb-1 flex flex-row text-lg",
                            currentUser === msg.memberId
                              ? "text-blue-500"
                              : "text-white",
                          )}
                        >
                          {msg.name}
                          <div>{new Date(msg.createdAt).toLocaleString()}</div>
                        </Label>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    ))}
                  </>
                ))
              : null}
          </div>
        </ul>
      </div>
    </>
  );
}

export default DirectMessages;
