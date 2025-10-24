import CreateEntryDialog from "@/components/labresults/create-entry-dialog";
import BatchEntryButton from "@/components/labresults/BatchEntryButton";
import PageLayout from "@/components/layout/page-layout";
import {
  PageActions,
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
        <PageHeaderHeading>Lab Results</PageHeaderHeading>
        <PageHeaderDescription>
          View and manage your Lab Results.
        </PageHeaderDescription>
        <PageActions>
          <CreateEntryDialog />
          <BatchEntryButton />
        </PageActions>
      </PageHeader>
      <PageLayout>{children}</PageLayout>
    </>
  );
}
