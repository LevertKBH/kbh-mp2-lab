"use client";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveEntrySchema } from "@/lib/zod/labresults";
import { api } from "@/trpc/react";
import { type PrismaModels } from "@/types/db-models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { ResponsiveModal } from "../shared/responsive-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface ResolveEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: PrismaModels["Downtime"];
}

export default function ResolveEntryDialog({
  open,
  onOpenChange,
  entry,
}: ResolveEntryDialogProps) {
  const id = useId();

  const form = useForm<z.infer<typeof resolveEntrySchema>>({
    resolver: zodResolver(resolveEntrySchema),
    defaultValues: {
      end_date: "",
      notes: "",
    },
  });

  const utils = api.useUtils();
  const resolveEntry = api.entries.resolveEntry.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.entries.invalidate();
      await utils.audit.invalidate();
      toast.success("Entry resolved", {
        description: "Entry has been resolved successfully",
      });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toast.error("Failed to resolve entry", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  return (
    <ResponsiveModal
      title="Resolve Entry"
      description="Resolve a downtime entry."
      hasTrigger={false}
      isOpen={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
      onCloseAutoFocus={() => {
        form.reset();
      }}
    >
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit(() => {
            resolveEntry.mutate({
              id: entry.id,
              ...form.getValues(),
            });
          })}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-startDate`}>End Date</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-startDate`}
                      max="9999-12-31T23:59"
                      disabled={!entry.start_date}
                      min={entry.start_date}
                      type="datetime-local"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notes here"
                      className="resize-none"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resolveEntry.isPending}
          >
            {resolveEntry.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Resolve Entry
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
