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
    const entries = await ctx.db.labInspection.findMany({
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
        const entry = await ctx.db.labInspection.create({
          data: {
            ...input,
            userId: ctx.session.user.id,
          },
        });

        await ctx.db.auditLog.create({
          data: {
            action: "create",
            entity_type: "labinspection",
            entity_id: entry.id,
            description: `Downtime entry created for ${entry.sample_description}`,
            metadata: JSON.stringify({
              sample_description: entry.sample_description,
              sample_type: entry.sample_type,
              plant: entry.plant,
              fe_perc: entry.fe_perc,
              sio_perc: entry.sio_perc,
              al2o3_perc: entry.al2o3_perc,
              p_perc: entry.p_perc,
              tio_perc: entry.tio_perc,
              mgo_perc: entry.mgo_perc,
              cao_perc: entry.cao_perc,
              p2o5_perc: entry.p2o5_perc,
              cu_perc: entry.cu_perc,
              screen425µ: entry.screen425µ,
              screen212µ: entry.screen212µ,
              screen150µ: entry.screen150µ,
              screen75µ: entry.screen75µ,
              screen106µ: entry.screen106µ,
              screen53µ: entry.screen53µ,
              screen45µ: entry.screen45µ,
              screen38µ: entry.screen38µ,
              pan: entry.pan,
              moisture: entry.moisture
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
        const deletedlabInspection = await ctx.db.labInspection.delete({
          where: { id },
        });

        const storedLabInspection = await ctx.db.deletedLabInspection.create({
          data: {
            ...deletedlabInspection,
            userId: ctx.session.user.id,
          },
        });
        
        await ctx.db.auditLog.create({
          data: {
            action: "delete",
            entity_type: "labinspections",
            entity_id: id,
            description: `Downtime entry deleted for ${storedLabInspection.sample_description}`,
            metadata: JSON.stringify({
              sample_description: storedLabInspection.sample_description,
              fe_perc: storedLabInspection.fe_perc,
              sio_perc: storedLabInspection.sio_perc,
              tio_perc: storedLabInspection.tio_perc,
              mgo_perc: storedLabInspection.mgo_perc,
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

        const currentDowntime = await ctx.db.labInspection.findUnique({
          where: { id },
        });

        await ctx.db.labInspection.update({ where: { id }, data: rest });

        await ctx.db.auditLog.create({
          data: {
            action: "update",
            entity_type: "downtime",
            description: `Downtime entry updated for ${currentDowntime?.sample_description}`,
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
});
