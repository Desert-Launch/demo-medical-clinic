"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  contactFormSchema,
  contactTopics,
  useSubmitContactMessage,
  type ContactFormValues,
} from "@/features/contact";

export function ContactForm() {
  const [receipt, setReceipt] = useState<string | null>(null);
  const submit = useSubmitContactMessage();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "Booking or rescheduling",
      message: "",
    },
  });

  if (receipt) {
    return (
      <div className="rounded-xl border border-success-100 bg-success-50 p-8">
        <CheckCircle2
          aria-hidden="true"
          className="size-8 text-success-700"
        />
        <h2 className="mt-4 text-2xl">Message received</h2>
        <p className="mt-3 text-stone-700">
          Your reference is{" "}
          <span data-numeric className="font-mono font-semibold">
            {receipt}
          </span>
          . The front desk replies within one working day, sooner during clinic
          hours.
        </p>
        <p className="mt-4 text-sm text-stone-600">
          Nothing was actually sent — this is a demo site.
        </p>
        <Button
          variant="outline"
          className="mt-6 bg-surface"
          onClick={() => {
            setReceipt(null);
            form.reset();
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => {
          submit.mutate(values, {
            onSuccess: (result) => setReceipt(result.reference),
          });
        })}
        className="space-y-6 rounded-xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is it about?</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contactTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+971 50 123 4567"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Tell us what you need. Do not include clinical details you would rather discuss in person."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={submit.isPending}>
            {submit.isPending ? "Sending…" : "Send message"}
          </Button>
          <p className="text-sm text-stone-500">
            For anything urgent, call the clinic instead.
          </p>
        </div>
      </form>
    </Form>
  );
}
