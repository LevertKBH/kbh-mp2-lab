"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import {
  type BetterAuthUpdateUser,
  betterAuthUpdateUserSchema,
} from "@/types/user-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserWithRole } from "better-auth/plugins";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "../shared/icons";
import { ResponsiveModal } from "../shared/responsive-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface UpdateUserDialogProps {
  user: UserWithRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateUserDialog({
  user,
  open,
  onOpenChange,
}: UpdateUserDialogProps) {
  const id = useId();

  const form = useForm<BetterAuthUpdateUser>({
    resolver: zodResolver(betterAuthUpdateUserSchema),
    defaultValues: {
      role: user.role as "user" | "admin",
    },
  });

  const utils = api.useUtils();
  const updateRole = api.users.updateRole.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.users.getAllUsers.invalidate();
      onOpenChange(false);
      toast.success("User updated", {
        description: "User has been updated successfully",
      });
    },
    onError: (error) => {
      toast.error("Failed to update user", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  return (
    <ResponsiveModal
      title="Update User"
      description="Update the user for this organization."
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
          onSubmit={form.handleSubmit((data) =>
            updateRole.mutate({
              userId: user.id,
              role: data.role,
            }),
          )}
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    className="gap-2"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem>
                      <FormControl>
                        <div className="relative flex w-full items-center gap-2 rounded-lg border border-input px-4 py-3 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent">
                          <RadioGroupItem
                            value="user"
                            id={`${id}-user`}
                            aria-describedby={`${id}-user-description`}
                            className="order-1 after:absolute after:inset-0"
                          />
                          <div className="grid grow gap-1">
                            <Label htmlFor={`${id}-user`}>Member</Label>
                            <p
                              id={`${id}-user-description`}
                              className="text-xs text-muted-foreground"
                            >
                              Not able to access user management
                            </p>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="relative flex w-full items-center gap-2 rounded-lg border border-input px-4 py-3 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent">
                          <RadioGroupItem
                            value="admin"
                            id={`${id}-admin`}
                            aria-describedby={`${id}-admin-description`}
                            className="order-1 after:absolute after:inset-0"
                          />
                          <div className="grid grow gap-1">
                            <Label htmlFor={`${id}-admin`}>Admin</Label>
                            <p
                              id={`${id}-admin-description`}
                              className="text-xs text-muted-foreground"
                            >
                              Able to access user management
                            </p>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={updateRole.isPending}
          >
            {updateRole.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update User
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
