import { entrySchema } from "@/lib/zod/labresults";
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
  /**
   * Fetch entries filtered by date, plant, and hours.
   */
  getFilteredEntries: protectedProcedure
    .input(z.object({
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      plant: z.string().nullable(),
      hours: z.array(z.string()).nullable(),
    }))
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, plant, hours } = input;
      return await ctx.db.labInspection.findMany({
        where: {
          AND: [
            ...(startDate ? [{ date: { gte: startDate } }] : []),
            ...(endDate ? [{ date: { lte: endDate } }] : []),
            ...(plant ? [{ plant }] : []),
            ...(hours ? [{ hour: { in: hours } }] : []),
          ],
        },
        orderBy: { created_at: "desc" },
      });
    }),
  createEntry: protectedProcedure
    .input(entrySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const entry = await ctx.db.labInspection.create({
          data: {
            ...input,
            userId: ctx.session.user.id,
            hour: input.hour ?? "0",
            fe_perc: input.fe_perc ?? "0",
            sio_perc: input.sio_perc ?? "0",
            al2o3_perc: input.al2o3_perc ?? "0",
            p_perc: input.p_perc ?? "0",
            tio_perc: input.tio_perc ?? "0",
            mgo_perc: input.mgo_perc ?? "0",
            cao_perc: input.cao_perc ?? "0",
            p2o5_perc: input.p2o5_perc ?? "0",
            cu_perc: input.cu_perc ?? "0",
            screen425: input.screen425 ?? "0",
            screen212: input.screen212 ?? "0",
            screen150: input.screen150 ?? "0",
            screen75: input.screen75 ?? "0",
            screen106: input.screen106 ?? "0",
            screen53: input.screen53 ?? "0",
            screen45: input.screen45 ?? "0",
            screen38: input.screen38 ?? "0",
            pan: input.pan ?? "0",
            moisture: input.moisture ?? "0"
          },
        });

        await ctx.db.auditLog.create({
          data: {
            action: "create",
            entity_type: "labinspection",
            entity_id: entry.id,
            description: `Lab Results entry created for ${entry.sample_description}`,
            metadata: JSON.stringify({
              sample_description: entry.sample_description,
              sample_type: entry.sample_type,
              plant: entry.plant,
              hour: entry.hour,
              fe_perc: entry.fe_perc,
              sio_perc: entry.sio_perc,
              al2o3_perc: entry.al2o3_perc,
              p_perc: entry.p_perc,
              tio_perc: entry.tio_perc,
              mgo_perc: entry.mgo_perc,
              cao_perc: entry.cao_perc,
              p2o5_perc: entry.p2o5_perc,
              cu_perc: entry.cu_perc,
              screen425: entry.screen425,
              screen212: entry.screen212,
              screen150: entry.screen150,
              screen75: entry.screen75,
              screen106: entry.screen106,
              screen53: entry.screen53,
              screen45: entry.screen45,
              screen38: entry.screen38,
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
/**
   * Create multiple entries in batch.
   */
  batchCreateEntries: protectedProcedure
    .input(z.array(entrySchema))
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db.$transaction(
        input.map((entry) =>
          ctx.db.labInspection.create({
            data: {
              ...entry,
              userId: ctx.session.user.id,
              hour: entry.hour ?? "0",
              fe_perc: entry.fe_perc ?? "0",
              sio_perc: entry.sio_perc ?? "0",
              al2o3_perc: entry.al2o3_perc ?? "0",
              p_perc: entry.p_perc ?? "0",
              tio_perc: entry.tio_perc ?? "0",
              mgo_perc: entry.mgo_perc ?? "0",
              cao_perc: entry.cao_perc ?? "0",
              p2o5_perc: entry.p2o5_perc ?? "0",
              cu_perc: entry.cu_perc ?? "0",
              screen425: entry.screen425 ?? "0",
              screen212: entry.screen212 ?? "0",
              screen150: entry.screen150 ?? "0",
              screen75: entry.screen75 ?? "0",
              screen106: entry.screen106 ?? "0",
              screen53: entry.screen53 ?? "0",
              screen45: entry.screen45 ?? "0",
              screen38: entry.screen38 ?? "0",
              pan: entry.pan ?? "0",
              moisture: entry.moisture ?? "0",
            },
          })
        )
      );
      await ctx.db.auditLog.createMany({
        data: created.map((entry) => ({
          action: "create",
          entity_type: "labinspection",
          entity_id: entry.id,
          description: `Lab Results entry created for ${entry.sample_description}`,
          metadata: JSON.stringify(entry),
          performed_by_name: ctx.session.user.name!,
          performed_by_identifier: ctx.session.user.email!,
          userId: ctx.session.user.id,
        })),
      });
      return created;
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
            description: `Lab Results deleted for ${storedLabInspection.sample_description}`,
            metadata: JSON.stringify({
              hour: storedLabInspection.hour,
              sample_description: storedLabInspection.sample_description,
              sample_type: storedLabInspection.sample_type,
              plant: storedLabInspection.plant,
              fe_perc: storedLabInspection.fe_perc,
              sio_perc: storedLabInspection.sio_perc,
              al2o3_perc: storedLabInspection.al2o3_perc,
              p_perc: storedLabInspection.p_perc,
              tio_perc: storedLabInspection.tio_perc,
              mgo_perc: storedLabInspection.mgo_perc,
              cao_perc: storedLabInspection.cao_perc,
              p2o5_perc: storedLabInspection.p2o5_perc,
              cu_perc: storedLabInspection.cu_perc,
              screen425: storedLabInspection.screen425,
              screen212: storedLabInspection.screen212,
              screen150: storedLabInspection.screen150,
              screen75: storedLabInspection.screen75,
              screen106: storedLabInspection.screen106,
              screen53: storedLabInspection.screen53,
              screen45: storedLabInspection.screen45,
              screen38: storedLabInspection.screen38,
              pan: storedLabInspection.pan,
              moisture: storedLabInspection.moisture
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

        const currentLabResults = await ctx.db.labInspection.findUnique({
          where: { id },
        });

        const updatedEntry = await ctx.db.labInspection.update({ where: { id }, data: rest });

        await ctx.db.auditLog.create({
          data: {
            action: "update",
            entity_type: "labinspections",
            description: `Lab Results updated for ${currentLabResults?.sample_description}`,
            entity_id: id!,
            metadata: JSON.stringify({
              old: currentLabResults,
              new: rest,
            }),
            performed_by_name: ctx.session.user.name,
            performed_by_identifier: ctx.session.user.email,
            userId: ctx.session.user.id,
          },
        });
return updatedEntry;
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

        const currentLabResults = await ctx.db.downtime.findUnique({
          where: { id },
        });

        await ctx.db.auditLog.create({
          data: {
            action: "resolve",
            entity_type: "downtime",
            entity_id: id,
            description: `Lab Results resolved for ${currentLabResults?.plant_equipment}`,
            metadata: JSON.stringify({
              old: currentLabResults,
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
