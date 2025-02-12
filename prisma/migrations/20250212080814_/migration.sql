/*
  Warnings:

  - You are about to drop the `invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[invitation] DROP CONSTRAINT [invitation_inviterId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[invitation] DROP CONSTRAINT [invitation_organizationId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[member] DROP CONSTRAINT [member_organizationId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[member] DROP CONSTRAINT [member_userId_fkey];

-- DropTable
DROP TABLE [dbo].[invitation];

-- DropTable
DROP TABLE [dbo].[member];

-- DropTable
DROP TABLE [dbo].[organization];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
