"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Icons } from "../shared/icons";
import { ResponsiveModal } from "../shared/responsive-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
const formSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export default function UpdateUserDialog() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const updatePassword = api.users.updatePassword.useMutation({
    onSuccess: async () => {
      form.reset();
      setOpen(false);
      toast.success("Password updated", {
        description: "Password has been updated successfully",
      });
      router.replace("/login");
    },
    onError: (error) => {
      toast.error("Failed to update password", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  return (
    <ResponsiveModal
      title="Update Password"
      description="Update your password. You will be logged out after updating."
      hasTrigger
      trigger={
        <Button variant="outline" size="sm">
          <PencilIcon className="mr-1 h-4 w-4" />
          Update your password
        </Button>
      }
      isOpen={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setOpen(open);
      }}
      onCloseAutoFocus={() => {
        form.reset();
      }}
    >
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((data) => updatePassword.mutate(data))}
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Current Password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={updatePassword.isPending}
          >
            {updatePassword.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Password
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
