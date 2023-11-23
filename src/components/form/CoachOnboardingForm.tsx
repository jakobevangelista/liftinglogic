"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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

  teamName: z.string().min(2, {
    message: "Team Name must be at least 2 characters.",
  }),
});

interface ProfileFormProps {
  firstName: string | null;
  lastName: string | null;
  email?: string;
}
export function CoachOnboardingForm({
  firstName,
  lastName,
  email,
}: ProfileFormProps) {
  const router = useRouter();
  const createCoach = api.client.createCoach.useMutation({
    onSuccess: (data) => {
      const redirectUrl = `/team/${data.publicTeamId}`;
      console.log(data);
      router.push(redirectUrl);
    },
    onError: (error) => {
      alert(
        `Error: failed to create coach, please try again. ${error.data?.code}`,
      );
      console.log(error);
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${firstName === "null" ? "" : firstName} ${
        lastName === "null" ? "" : lastName
      }`,
      email: `${email ?? ""}`,
      teamName: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);

    createCoach.mutate({
      name: values.name,
      emailAddress: values.email,
      teamName: values.teamName,
    });
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
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                  <Input placeholder="shadcn" {...field} disabled={true} />
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

        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Team Name" {...field} />
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
