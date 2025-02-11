import { authClient } from "@/lib/auth-client";
import { type PrismaModels } from "@/types/db-models";
import { EyeIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AuditRowActionsProps {
  audit: PrismaModels["AuditLog"];
}

const AuditRowActions: FC<AuditRowActionsProps> = ({ audit }) => {
  const session = authClient.useSession();

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
          <DropdownMenuItem
            asChild
            className="flex items-center justify-between"
          >
            <Link
              href={`/dashboard/audit/${audit.id}`}
              className="flex items-center justify-between"
            >
              View
              <EyeIcon />
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuditRowActions;
