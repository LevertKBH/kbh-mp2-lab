import PageLayout from "@/components/layout/page-layout";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Audit</PageHeaderHeading>
        <PageHeaderDescription>
          View and manage your audit logs.
        </PageHeaderDescription>
      </PageHeader>
      <PageLayout>{children}</PageLayout>
    </>
  );
}
