import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [nextCookies(), organization()],
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(db, {
    provider: "sqlserver",
  }),
});
