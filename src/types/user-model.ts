import { type authClient } from "@/lib/auth-client";
import { USER_ROLES, type UserRole } from "@/lib/roles";
import { z } from "zod";

export type BetterAuthUser = (typeof authClient.$Infer.Session)["user"];
export type BetterAuthCreateUser = Parameters<
  typeof authClient.admin.createUser
>[0];
export type BetterAuthUpdateUser = {
  role: UserRole;
};

export const betterAuthUserSchema = z.custom<BetterAuthUser>();
export const betterAuthCreateUserSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  role: z.enum(USER_ROLES),
});
export const betterAuthUpdateUserSchema = z.object({
  role: z.enum(USER_ROLES),
});
