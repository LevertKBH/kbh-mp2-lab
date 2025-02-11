import { api } from "@/trpc/react";
import { type PrismaModels } from "@/types/db-models";
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

interface confirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: PrismaModels["Downtime"];
}

const ConfirmDeleteDialog: FC<confirmDeleteDialogProps> = ({
  open,
  onOpenChange,
  entry,
}) => {
  const utils = api.useUtils();
  const deleteEntry = api.entries.deleteEntry.useMutation({
    onSuccess: async () => {
      await utils.entries.invalidate();
      await utils.audit.invalidate();
      toast.success("Entry deleted successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to delete entry", {
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
            entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteEntry.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteEntry.mutate({ id: entry.id })}
            className="bg-destructive text-destructive-foreground"
            disabled={deleteEntry.isPending}
          >
            {deleteEntry.isPending && (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            )}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
