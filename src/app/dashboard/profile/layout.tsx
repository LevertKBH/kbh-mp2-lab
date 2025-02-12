import PageLayout from "@/components/layout/page-layout";
import UpdatePasswordDialog from "@/components/profile/update-password-dialog";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import { SignOut } from "@/components/shared/sign-out";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Profile</PageHeaderHeading>
        <PageHeaderDescription>
          View and manage your profile.
        </PageHeaderDescription>
        <PageActions>
          <UpdatePasswordDialog />
          <SignOut />
        </PageActions>
      </PageHeader>
      <PageLayout>{children}</PageLayout>
    </>
  );
}
