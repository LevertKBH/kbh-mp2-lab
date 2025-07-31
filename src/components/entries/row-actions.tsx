import { authClient } from "@/lib/auth-client";
import { type PrismaModels } from "@/types/db-models";
import {
  CheckIcon,
  DownloadIcon,
  EditIcon,
  MoreHorizontal,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { type FC, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ConfirmDeleteDialog from "./confirm-delete-dialog";
import EditEntryDialog from "./edit-entry-dialog";
import ResolveEntryDialog from "./resolve-entry-dialog";

interface EntryRowActionsProps {
  entry: PrismaModels["LabInspection"];
}

const EntryRowActions: FC<EntryRowActionsProps> = ({ entry }) => {
  const session = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [openResolve, setOpenResolve] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(
          <DropdownMenuItem
            onClick={() => setOpenResolve(true)}
            className="flex items-center justify-between"
          >
            Resolve
            <CheckIcon />
          </DropdownMenuItem>
        )}
        {session.data?.user.role === "admin" && (
          <>
            { <DropdownMenuSeparator />}
            <Link href={`/dashboard/pdf/${entry.id}/`}>
              <DropdownMenuItem className="flex items-center justify-between">
                PDF
                <DownloadIcon className="h-3 w-3" />
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setOpenEdit(true)}
              className="flex items-center justify-between text-destructive"
            >
              Edit
              <EditIcon className="h-3 w-3" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="flex items-center justify-between text-destructive"
            >
              Delete
              <TrashIcon className="h-3 w-3" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
      <ConfirmDeleteDialog open={open} onOpenChange={setOpen} entry={entry} />
      <EditEntryDialog
        entry={entry}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
    </DropdownMenu>
  );
};

export default EntryRowActions;
