"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { linksConfig } from "@/config/links";
import { type authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Icons } from "../shared/icons";

export function MainNav({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link
        href="/dashboard/entries"
        className="mr-4 flex items-center gap-2 lg:mr-6"
      >
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">MP2 Downtime</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        {linksConfig.mainNav.map((link) => {
          if (link.requiresAdmin && session.user.role !== "admin") {
            return null;
          }
          return (
            <Link
              key={link.href}
              href={link.href ?? ""}
              className={cn(
                "hover:text-foreground/80 transition-colors",
                pathname?.startsWith(link.href ?? "")
                  ? "text-foreground"
                  : "text-foreground/80",
              )}
            >
              {link.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
