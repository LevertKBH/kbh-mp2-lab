"use server";

import { auth } from "@/lib/auth";
import { UserIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { ModeSwitcher } from "../shared/mode-switcher";
import { Button } from "../ui/button";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">
          {session && (
            <>
              <MainNav session={session} />
              <MobileNav session={session} />
            </>
          )}
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            <nav className="flex items-center gap-0.5">
              <ModeSwitcher />

              <Button
                variant="ghost"
                className="h-8 w-8 px-0"
                type="submit"
                asChild
              >
                <Link href="/dashboard/profile">
                  <UserIcon />
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
