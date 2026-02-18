/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { linksConfig } from "@/config/links";
import { type authClient } from "@/lib/auth-client";
import { getRolePlant } from "@/lib/roles";
import { cn } from "@/lib/utils";

export function MainNav({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const pathname = usePathname();
  const rolePlant = getRolePlant(session.user.role ?? null);
  const logoSrc =
    rolePlant === "SAOB"
      ? "/saob_logo.png"
      : rolePlant === "LIO"
        ? "/lio_logo.png"
        : "/favicon.png";
  const logoAlt = rolePlant ? `${rolePlant} Lab Results` : "MP2 Lab Results";

  return (
    <div className="mr-4 hidden md:flex">
      <Link
        href="/dashboard/labresults"
        className="mr-4 flex items-center gap-2 lg:mr-6"
      >
        <div className="relative mt-2 h-10 w-16">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-full w-full"
          />
        </div>
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
