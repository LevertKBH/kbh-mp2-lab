/**
 * Stub module declarations for PDFKit standalone builds.
 * All imports return `any` to bypass missing type definitions
 * and allow usage of embedStandardFonts and PDFDocument methods.
 */

declare module "pdfkit/js/pdfkit.standalone.js" {
  const PDFDocument: any;
  export default PDFDocument;
}

declare module "pdfkit/js/pdfkit.standalone" {
  import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
  export default PDFDocument;
}