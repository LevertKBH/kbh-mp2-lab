import { authClient } from "@/lib/auth-client";
import { type UserWithRole } from "better-auth/plugins";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ConfirmDeleteUserDialog from "./confirm-delete-dialog";
import UpdateUserDialog from "./update-user-dialog";

interface UserRowActionsProps {
  user: UserWithRole;
}

const UserRowActions: FC<UserRowActionsProps> = ({ user }) => {
  const session = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session.data?.user.role === "admin" && (
          <>
            <DropdownMenuItem
              onClick={() => setOpenUpdate(true)}
              className="flex items-center justify-between text-destructive"
            >
              Update
              <PencilIcon className="h-3 w-3" />
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
      <ConfirmDeleteUserDialog open={open} onOpenChange={setOpen} user={user} />
      <UpdateUserDialog
        user={user}
        open={openUpdate}
        onOpenChange={setOpenUpdate}
      />
    </DropdownMenu>
  );
};

export default UserRowActions;
