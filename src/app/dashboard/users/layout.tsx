import PageLayout from "@/components/layout/page-layout";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import CreateUserDialog from "@/components/users/create-user-dialog";

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
        <PageActions>
          <CreateUserDialog />
        </PageActions>
      </PageHeader>
      <PageLayout>{children}</PageLayout>
    </>
  );
}
