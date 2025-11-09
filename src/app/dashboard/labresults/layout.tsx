import PageLayout from "@/components/layout/page-layout";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import LabActions from "@/components/labresults/LabActions";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Lab Results</PageHeaderHeading>
        <PageHeaderDescription>
          View and manage your Lab Results.
        </PageHeaderDescription>
        <PageActions>
          <LabActions />
        </PageActions>
      </PageHeader>
      <PageLayout>{children}</PageLayout>
    </>
  );
}
