"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ModeSwitcher } from "../shared/mode-switcher";
import { SignOut } from "../shared/sign-out";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <header className="border-grid bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
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
              <SignOut />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
