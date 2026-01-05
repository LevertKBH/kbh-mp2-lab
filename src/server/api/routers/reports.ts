import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { LabInspection } from "@prisma/client";
import path from "path";

/**
 * Generate a PDF for given entries with title.
 */
const createPdfBase64 = async (
  entries: LabInspection[],
  title: string,
  date: string,
  hour: string
): Promise<string> => {
  const doc: any = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const endPromise = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err: Error) => reject(err));
  });

  // Title
  doc.font("Helvetica-Bold").fontSize(18).text(title, { align: "center" });
  doc.moveDown();

  // Date & Hour
  doc.font("Helvetica").fontSize(12).text(`Date: ${date}`, { continued: true });
  doc.text(`   Hour: ${hour}`);
  doc.moveDown();

  // Table setup
  const tableTop = doc.y;
  const cellPadding = 8;
  const columns = [
    "Sample Description",
    "%Fe",
    "%SiO2",
    "%TiO2",
    "%MgO",
    "%CaO",
    "%P2O5",
    "%Cu",
    "%H2O",
  ];
  const colWidths: number[] = [120, 52, 52, 52, 52, 52, 52, 52, 52];
  const headerHeight =
    Math.max(
      ...columns.map((col, i) =>
        doc.heightOfString(col, { width: colWidths[i]! - cellPadding * 2 })
      )
    ) +
    cellPadding * 2;
  const dataRowHeight = 35;
  const tableWidth = colWidths.reduce((sum, w) => sum + w, 0);
  const tableLeft = doc.x ?? 0;

  // Draw grid
  doc.lineWidth(0.5);
  // Horizontal
  for (let i = 0; i <= entries.length + 1; i++) {
    const y =
      tableTop +
      (i === 0
        ? 0
        : i === 1
        ? headerHeight
        : headerHeight + (i - 1) * dataRowHeight);
    doc.moveTo(tableLeft, y).lineTo(tableLeft + tableWidth, y).stroke();
  }
  // Vertical
  let xLine = tableLeft;
  for (let i = 0; i <= colWidths.length; i++) {
    doc
      .moveTo(xLine, tableTop)
      .lineTo(xLine, tableTop + headerHeight + entries.length * dataRowHeight)
      .stroke();
    xLine += colWidths[i] ?? 0;
  }

  // Header text
  doc.font("Helvetica-Bold").fontSize(10);
  let textX = tableLeft + cellPadding;
  const headerY = tableTop + cellPadding;
  columns.forEach((col, i) => {
    doc.text(col, textX, headerY, {
      width: colWidths[i]! - cellPadding * 2,
      ellipsis: true,
    });
    textX += colWidths[i]!;
  });

  // Rows
  doc.font("Helvetica").fontSize(10);
  entries.forEach((row, rowIndex) => {
    const yPos = tableTop + headerHeight + rowIndex * dataRowHeight + cellPadding;
    let xCell = tableLeft + cellPadding;
    const cells = [
      row.sample_description,
      row.fe_perc,
      row.sio_perc,
      row.tio_perc,
      row.mgo_perc,
      row.cao_perc,
      row.p2o5_perc,
      row.cu_perc,
      row.moisture,
    ];
    cells.forEach((cell, i) => {
      doc.text(String(cell), xCell, yPos, {
        width: colWidths[i]! - cellPadding * 2,
        ellipsis: true,
      });
      xCell += colWidths[i]!;
    });
  });

  doc.end();
  const buffer = await endPromise;
  return buffer.toString("base64");
};

export const reportsRouter = createTRPCRouter({
  exportHourlyDistribution: protectedProcedure
    .input(z.object({ date: z.string(), hour: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      const { date, hour } = input;
      const entries = await ctx.db.labInspection.findMany({
        where: { date, hour },
        orderBy: { sample_description: "asc" },
      });
      return createPdfBase64(entries, "Hourly Distribution Report", date, hour);
    }),

  exportFoskorHourlyDistribution: protectedProcedure
    .input(z.object({ date: z.string(), hour: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      const { date, hour } = input;
      const entries = await ctx.db.labInspection.findMany({
        where: { date, hour, sample_description: "Plant Feed - Frm CNV -2" },
        orderBy: { sample_description: "asc" },
      });
      return createPdfBase64(entries, "Foskor Hourly Distribution Report", date, hour);
    }),
});