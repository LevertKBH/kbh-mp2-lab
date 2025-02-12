"use server";

import Profile from "@/components/profile/profile-page";
import { api } from "@/trpc/server";

export default async function ProfilePage() {
  void api.users.getCurrentUser.prefetch();
  return <Profile />;
}
