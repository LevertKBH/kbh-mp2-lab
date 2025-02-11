import { type authClient } from "@/lib/auth-client";
import { z } from "zod";

export type BetterAuthUser = (typeof authClient.$Infer.Session)["user"];
export type BetterAuthCreateUser = Parameters<
  typeof authClient.admin.createUser
>[0];
export type BetterAuthUpdateUser = {
  role: "user" | "admin";
};

export const betterAuthUserSchema = z.custom<BetterAuthUser>();
export const betterAuthCreateUserSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  role: z.enum(["user", "admin"]),
});
export const betterAuthUpdateUserSchema = z.object({
  role: z.enum(["user", "admin"]),
});
