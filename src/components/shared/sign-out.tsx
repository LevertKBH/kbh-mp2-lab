"use client";

import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";

export function SignOut() {
  const handleSignOut = async () => {
    await authClient.signOut();
    redirect("/login");
  };
  return (
    <form action={handleSignOut}>
      <Button variant="ghost" className="h-8 w-8 px-0" type="submit">
        <LogOutIcon />
      </Button>
    </form>
  );
}
