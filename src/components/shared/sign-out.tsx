"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";

export function SignOut() {
  const handleSignOut = async () => {
    await authClient.signOut();
    redirect("/login");
  };
  return (
    <form action={handleSignOut}>
      <Button type="submit">Sign out</Button>
    </form>
  );
}
