import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";

export const auditRouter = createTRPCRouter({
  getAllAudits: adminProcedure.query(async ({ ctx }) => {
    const audits = await ctx.db.auditLog.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return audits;
  }),
  getAuditById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const audit = await ctx.db.auditLog.findUnique({
        where: { id: input.id },
      });

      return audit;
    }),
});
