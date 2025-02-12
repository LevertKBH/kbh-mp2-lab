"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { linksConfig } from "@/config/links";
import { type authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
        <div className="relative mt-2 h-10 w-16">
          <Image src="/favicon.png" alt="MP2 Downtime" fill />
        </div>
        {/* <span className="hidden font-bold lg:inline-block">MP2 Downtime</span> */}
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
                "transition-colors hover:text-foreground/80",
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
