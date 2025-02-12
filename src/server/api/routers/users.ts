import { auth } from "@/lib/auth";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { betterAuthCreateUserSchema } from "@/types/user-model";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  getAllUsers: adminProcedure.query(async ({}) => {
    const users = await auth.api.listUsers({
      headers: await headers(),
      query: {
        limit: 999,
      },
    });

    return users;
  }),
  updatePassword: protectedProcedure
    .input(
      z.object({
        newPassword: z.string(),
        currentPassword: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { newPassword, currentPassword } = input;

      try {
        await auth.api.changePassword({
          headers: await headers(),
          body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "An unexpected error occurred while updating the password",
        });
      }
    }),
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "admin"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, role } = input;
      if (ctx.user.id === userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot update your own role",
        });
      }

      await auth.api.setRole({
        headers: await headers(),
        body: {
          userId: userId,
          role: role,
        },
      });
    }),
  createUser: adminProcedure
    .input(betterAuthCreateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, name, role } = input;
      const { user } = await auth.api.createUser({
        headers: await headers(),
        body: {
          email,
          password,
          name,
          role,
        },
      });
    }),
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = input;
      const userToDelete = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (userToDelete) {
        await auth.api.removeUser({
          headers: await headers(),
          body: {
            userId: userId,
          },
        });

        await ctx.db.deletedUser.create({
          data: {
            name: userToDelete.name,
            role: userToDelete.role!,
            identifier: userToDelete.email,
            userId: userId,
          },
        });
      }
    }),
});
