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
        <PageHeaderHeading>Users</PageHeaderHeading>
        <PageHeaderDescription>
          View and manage your users.
        </PageHeaderDescription>
      </PageHeader>
      <PageLayout>{children}</PageLayout>
    </>
  );
}
