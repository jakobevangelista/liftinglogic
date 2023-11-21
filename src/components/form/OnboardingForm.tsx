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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ActionTooltip } from "../action-tooltip";
import { Checkbox } from "../ui/checkbox";
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Please enter a valid email." }),
    isCoach: z.boolean().optional(),
    teamName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isCoach && !data.teamName) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a team name",
        path: ["teamName"],
      });
    } else if (!data.isCoach) {
      data.teamName = "";
    }
  });

interface ProfileFormProps {
  firstName: string | null;
  lastName: string | null;
  email?: string;
  userId: string;
}
export function ProfileForm({
  firstName,
  lastName,
  email,
  userId,
}: ProfileFormProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${firstName === "null" ? "" : firstName} ${
        lastName === "null" ? "" : lastName
      }`,
      email: `${email}`,
      isCoach: false,
      teamName: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                <Input placeholder="shadcn" {...field} />
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
          name="isCoach"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Are you a coach?</FormLabel>
                <FormDescription>
                  If you are a coach, you will fill out a team form after this
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {form.getValues("isCoach") ? (
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
        ) : null}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
