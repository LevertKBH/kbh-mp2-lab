import { SignOut } from "@/components/shared/sign-out";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome {session?.user?.name}</p>
      </div>
      <SignOut />
    </div>
  );
}
