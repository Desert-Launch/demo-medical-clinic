"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  bookingDetailsSchema,
  emptyBookingDetails,
  type BookingDetailsValues,
} from "@/features/booking/schema";
import { SELF_PAY } from "@/features/patients/schema";
import { site } from "@/lib/site";
import { patientGenderLabels, patientGenders } from "@/types";

export function StepDetails({
  defaultValues,
  onBack,
  onSubmit,
  pending,
}: {
  defaultValues: BookingDetailsValues | null;
  onBack: () => void;
  onSubmit: (values: BookingDetailsValues) => void;
  pending: boolean;
}) {
  const form = useForm<BookingDetailsValues>({
    resolver: zodResolver(bookingDetailsSchema),
    defaultValues: defaultValues ?? emptyBookingDetails,
  });

  const insurer = form.watch("insurer");

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div>
          <h2 className="text-xl font-semibold">Who is the appointment for?</h2>
          <p className="mt-2 text-stone-600">
            If we already hold a record under this email, we will add the visit
            to it rather than start a second one.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input autoComplete="given-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input autoComplete="family-name" {...field} />
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
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input type="date" autoComplete="bday" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patientGenders.map((value) => (
                        <SelectItem key={value} value={value}>
                          {patientGenderLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <h2 className="text-xl font-semibold">Insurance</h2>
          <p className="mt-2 text-stone-600">
            We confirm your cover before the appointment. Self-paying patients
            get a claimable invoice at the desk.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="insurer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurer</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose an insurer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SELF_PAY}>
                        I am paying myself
                      </SelectItem>
                      {site.insurers.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {insurer !== SELF_PAY ? (
              <FormField
                control={form.control}
                name="insuranceMemberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership number</FormLabel>
                    <FormControl>
                      <Input placeholder="As printed on your card" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave it blank if you do not have the card to hand — we
                      will ask at the desk.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What brings you in?</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="A line or two is plenty — e.g. persistent cough for two weeks."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The doctor reads this before you arrive.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border bg-stone-25 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="font-normal leading-relaxed">
                  I agree to the clinic holding this appointment and contacting me
                  about it by phone or email.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            disabled={pending}
          >
            Back
          </Button>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Holding your slot…" : "Confirm booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
