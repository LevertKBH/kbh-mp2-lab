import { entrySchema } from "@/lib/zod/entries";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const entriesRouter = createTRPCRouter({
  getAllEntries: protectedProcedure.query(async ({ ctx }) => {
    const entries = await ctx.db.downtime.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return entries;
  }),
  createEntry: protectedProcedure
    .input(entrySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const entry = await ctx.db.downtime.create({
          data: {
            ...input,
            userId: ctx.session.user.id,
          },
        });

        return entry;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create entry",
        });
      }
    }),
  deleteEntry: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input;
        await ctx.db.downtime.delete({ where: { id } });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete entry",
        });
      }
    }),
  updateEntry: adminProcedure
    .input(entrySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...rest } = input;
        await ctx.db.downtime.update({ where: { id }, data: rest });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update entry",
        });
      }
    }),
  resolveEntry: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        end_date: z.string(),
        notes: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...rest } = input;
        await ctx.db.downtime.update({
          where: { id },
          data: { ...rest },
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to resolve entry",
        });
      }
    }),
});
