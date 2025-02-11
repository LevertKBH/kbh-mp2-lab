import { auth } from "@/lib/auth";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { betterAuthCreateUserSchema } from "@/types/user-model";
import { headers } from "next/headers";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getAllUsers: adminProcedure.query(async ({}) => {
    const users = await auth.api.listUsers({
      headers: await headers(),
      query: {
        limit: 999,
      },
    });

    return users;
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
        throw new Error("You cannot update your own role");
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
