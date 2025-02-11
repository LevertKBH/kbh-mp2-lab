import { api } from "@/trpc/react";
import { type UserWithRole } from "better-auth/plugins";
import { type FC } from "react";
import { toast } from "sonner";
import { Icons } from "../shared/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface ConfirmDeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole;
}

const ConfirmDeleteUserDialog: FC<ConfirmDeleteUserDialogProps> = ({
  open,
  onOpenChange,
  user,
}) => {
  const utils = api.useUtils();

  const deleteUser = api.users.deleteUser.useMutation({
    onSuccess: async () => {
      await utils.users.getAllUsers.invalidate();
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete user", {
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
            This action cannot be undone. This will permanently delete this
            user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUser.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteUser.mutate({ userId: user.id })}
            className="bg-destructive text-destructive-foreground"
            disabled={deleteUser.isPending}
          >
            {deleteUser.isPending && (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            )}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteUserDialog;
