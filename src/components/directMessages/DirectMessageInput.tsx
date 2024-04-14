"use client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { pusherClient } from "@/lib/pusher";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { Button } from "../ui/button";

interface DirectMessageInputProps {
  conversationPublicId: string;
}

const directMessageFormSchema = z.object({
  message: z.string().min(1),
});

export default function DirectMessageInput({
  conversationPublicId,
}: DirectMessageInputProps) {
  const sendMessageMutation = api.clientRouter.sendMessage.useMutation();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof directMessageFormSchema>>({
    resolver: zodResolver(directMessageFormSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof directMessageFormSchema>) {
    sendMessageMutation.mutate({
      message: values.message,
      conversationPublicId,
    });
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }

    pusherClient.subscribe(conversationPublicId);

    pusherClient.bind("new-message", async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ["client", "getMessages"],
          {
            input: {
              conversationId: `${conversationPublicId}`,
            },
            type: "query",
          },
        ],
      });
      return () => {
        pusherClient.unsubscribe(conversationPublicId);
      };
    });
  }, [
    form,
    form.formState.isSubmitSuccessful,
    queryClient,
    conversationPublicId,
  ]);

  return (
    <>
      <div className="flex flex-row items-center space-x-2">
        {/* <Input type="email" placeholder="Enter Message" />
        <Button type="submit">Send</Button> */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-row items-end py-4 lg:items-center"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <div className="w-full">
                  <FormItem>
                    <FormControl>
                      {/* <div
                        // placeholder="Message Jakob"
                        contentEditable="true"
                        role="textbox"
                        {...field}
                        className="h-10 w-full resize break-words rounded-md bg-blue-900/40 p-2"
                      /> */}
                      <TextareaAutosize
                        // placeholder="Message Jakob"
                        contentEditable="true"
                        role="textbox"
                        {...field}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            "form" in e.target
                          ) {
                            e.preventDefault();
                            (e.target.form as HTMLFormElement).requestSubmit();
                          }
                        }}
                        className="h-10 w-full resize-none break-words rounded-sm bg-blue-900/40 p-4"
                      />
                    </FormControl>
                  </FormItem>
                  {/* <FormControl>
                    <Input placeholder="Enter Message" {...field} />
                  </FormControl> */}
                </div>
              )}
            />
            <Button type="submit">Send</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
