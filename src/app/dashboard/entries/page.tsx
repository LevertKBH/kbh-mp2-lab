"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function MainPage() {
  return (
    <div>
      <Button
        onClick={async () =>
          await authClient.admin.createUser({
            email: "test@test.com",
            password: "Jarrod@29100!",
            name: "Test User",
            role: "user",
          })
        }
      >
        Click me
      </Button>
    </div>
  );
}
