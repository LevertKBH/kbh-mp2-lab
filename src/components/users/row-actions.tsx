import { authClient } from "@/lib/auth-client";
import { type UserWithRole } from "better-auth/plugins";
import { BanIcon, MoreHorizontal, PencilIcon } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import BanUserDialog from "./ban-dialog";
import { ConfirmUnbanDialog } from "./confirm-unban-dialog";
import UpdateUserDialog from "./update-user-dialog";

interface UserRowActionsProps {
  user: UserWithRole;
}

const UserRowActions: FC<UserRowActionsProps> = ({ user }) => {
  const session = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUnban, setOpenUnban] = useState(false);

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
              Update User
              <PencilIcon className="h-3 w-3" />
            </DropdownMenuItem>
            {user.banned ? (
              <DropdownMenuItem
                onClick={() => setOpenUnban(true)}
                className="flex items-center justify-between text-destructive"
              >
                Unban User
                <BanIcon className="h-3 w-3" />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="flex items-center justify-between text-destructive"
              >
                Ban User
                <BanIcon className="h-3 w-3" />
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
      <BanUserDialog open={open} onOpenChange={setOpen} user={user} />
      <UpdateUserDialog
        user={user}
        open={openUpdate}
        onOpenChange={setOpenUpdate}
      />
      <ConfirmUnbanDialog
        open={openUnban}
        onOpenChange={setOpenUnban}
        user={user}
      />
    </DropdownMenu>
  );
};

export default UserRowActions;
