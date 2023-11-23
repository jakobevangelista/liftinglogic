"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ActionTooltip } from "../action-tooltip";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

interface ProfileFormProps {
  teamPublicId: string;
  publicUserId: string;
  email?: string;
  name?: string;
  clerkId: string;
}
export function AthleteOnboardingForm({
  teamPublicId,
  publicUserId,
  email,
  name,
  clerkId,
}: ProfileFormProps) {
  const router = useRouter();
  const createAthlete = api.client.createAthlete.useMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${name === "null" ? "" : name}`,
      email: `${email ?? ""}`,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);

    createAthlete.mutate(
      {
        name: values.name,
        emailAddress: values.email,
        clerkId: clerkId,
        publicUserId: publicUserId,
      },
      {
        onSuccess: () => {
          router.push(`/team/${teamPublicId}`);
        },
        onError: (error) => {
          alert("Error: failed to create athlete, please try again.");
          console.log(error);
        },
      },
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="flex flex-row">
                  <Input
                    placeholder="Email Address"
                    {...field}
                    disabled={true}
                  />
                  <ActionTooltip
                    label="log in with the email you want to use for your team"
                    side="bottom"
                    align="end"
                  >
                    <Button variant={"ghost"}>Not you?</Button>
                  </ActionTooltip>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
