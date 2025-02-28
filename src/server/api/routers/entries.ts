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

        await ctx.db.auditLog.create({
          data: {
            action: "create",
            entity_type: "downtime",
            entity_id: entry.id,
            description: `Downtime entry created for ${entry.plant_equipment}`,
            metadata: JSON.stringify({
              start_date: entry.start_date,
              end_date: entry.end_date,
              plant_category: entry.plant_category,
              plant_section: entry.plant_section,
              discipline: entry.discipline,
              plant_equipment: entry.plant_equipment,
              breakdown_description: entry.breakdown_description,
              notes: entry.notes,
            }),
            performed_by_name: ctx.session.user.name,
            performed_by_identifier: ctx.session.user.email,
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
        const deletedDowntime = await ctx.db.downtime.delete({
          where: { id },
        });

        const storedDowntime = await ctx.db.deletedDowntime.create({
          data: {
            ...deletedDowntime,
            userId: ctx.session.user.id,
          },
        });

        await ctx.db.auditLog.create({
          data: {
            action: "delete",
            entity_type: "downtime",
            entity_id: id,
            description: `Downtime entry deleted for ${storedDowntime.plant_equipment}`,
            metadata: JSON.stringify({
              start_date: storedDowntime.start_date,
              end_date: storedDowntime.end_date,
              breakdown_description: storedDowntime.breakdown_description,
              notes: storedDowntime.notes,
              plant_category: storedDowntime.plant_category,
              plant_section: storedDowntime.plant_section,
              discipline: storedDowntime.discipline,
              plant_equipment: storedDowntime.plant_equipment,
            }),
            performed_by_name: ctx.session.user.name,
            performed_by_identifier: ctx.session.user.email,
            userId: ctx.session.user.id,
          },
        });
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

        const currentDowntime = await ctx.db.downtime.findUnique({
          where: { id },
        });

        await ctx.db.downtime.update({ where: { id }, data: rest });

        await ctx.db.auditLog.create({
          data: {
            action: "update",
            entity_type: "downtime",
            description: `Downtime entry updated for ${currentDowntime?.plant_equipment}`,
            entity_id: id!,
            metadata: JSON.stringify({
              old: currentDowntime,
              new: rest,
            }),
            performed_by_name: ctx.session.user.name,
            performed_by_identifier: ctx.session.user.email,
            userId: ctx.session.user.id,
          },
        });
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

        const currentDowntime = await ctx.db.downtime.findUnique({
          where: { id },
        });

        await ctx.db.auditLog.create({
          data: {
            action: "resolve",
            entity_type: "downtime",
            entity_id: id,
            description: `Downtime entry resolved for ${currentDowntime?.plant_equipment}`,
            metadata: JSON.stringify({
              old: currentDowntime,
              new: rest,
            }),
            performed_by_name: ctx.session.user.name,
            performed_by_identifier: ctx.session.user.email,
            userId: ctx.session.user.id,
          },
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to resolve entry",
        });
      }
    }),
  getEntryById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const downtime = await ctx.db.downtime.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      const auditLogs = await ctx.db.auditLog.findMany({
        where: {
          entity_id: id,
        },
      });

      return { user: ctx.session.user, downtime, auditLogs };
    }),
  generatePdf: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const downtime = await ctx.db.downtime.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      const auditLogs = await ctx.db.auditLog.findMany({
        where: {
          entity_id: id,
        },
      });

      return { user: ctx.session.user, downtime, auditLogs };
    }),
});
