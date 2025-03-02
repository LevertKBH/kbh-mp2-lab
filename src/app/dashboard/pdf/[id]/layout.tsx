import PageLayout from "@/components/layout/page-layout";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";

export default function PDFLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>PDF</PageHeaderHeading>
        <PageHeaderDescription>
          View and download the PDF for this downtime entry.
        </PageHeaderDescription>
      </PageHeader>
      <PageLayout>{children}</PageLayout>
    </>
  );
}
