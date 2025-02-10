BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[session] ADD [impersonatedBy] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[user] ADD [banExpires] DATETIME2,
[banReason] NVARCHAR(1000),
[banned] BIT,
[role] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
