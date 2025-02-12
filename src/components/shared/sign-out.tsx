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
      <Button variant="outline" size="sm" type="submit">
        <LogOutIcon className="mr-1 h-4 w-4" />
        Sign out
      </Button>
    </form>
  );
}
