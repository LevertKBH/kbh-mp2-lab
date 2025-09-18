import CreateEntryDialog from "@/components/entries/create-entry-dialog";
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
        </PageActions>
      </PageHeader>
      <PageLayout>{children}</PageLayout>
    </>
  );
}
