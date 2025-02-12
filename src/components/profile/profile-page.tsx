"use client";

import { api } from "@/trpc/react";
import { format } from "date-fns";

export default function Profile() {
  const [user] = api.users.getCurrentUser.useSuspenseQuery();
  return (
    <div>
      <div className="">
        <dl className="">
          <div className="border-b px-4 pb-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Name</dt>
            <dd className="mt-1 flex items-center text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {user?.name}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Email</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {user?.email}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Role</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {user?.role}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Created at</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {format(user?.createdAt, "MM/dd/yyyy hh:mm a")}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
