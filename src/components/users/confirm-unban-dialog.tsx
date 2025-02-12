"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/trpc/react";
import { type UserWithRole } from "better-auth/plugins";
import { toast } from "sonner";
import { Icons } from "../shared/icons";

interface ConfirmUnbanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole;
}

export function ConfirmUnbanDialog({
  open,
  onOpenChange,
  user,
}: ConfirmUnbanDialogProps) {
  const utils = api.useUtils();

  const unbanUser = api.users.unbanUser.useMutation({
    onSuccess: async () => {
      await utils.users.getAllUsers.invalidate();
      toast.success("User unbanned successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to unban user", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will unban the user and allow them to access the platform
            again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            disabled={unbanUser.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => unbanUser.mutate({ userId: user.id })}
            disabled={unbanUser.isPending}
          >
            {unbanUser.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
