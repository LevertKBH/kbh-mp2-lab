/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[Post];

-- CreateTable
CREATE TABLE [dbo].[downtime] (
    [id] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [downtime_status_df] DEFAULT 'down',
    [start_date] NVARCHAR(1000) NOT NULL,
    [end_date] NVARCHAR(1000),
    [plant_category] NVARCHAR(1000) NOT NULL CONSTRAINT [downtime_plant_category_df] DEFAULT 'Plant Outage',
    [plant_section] NVARCHAR(1000) NOT NULL,
    [discipline] NVARCHAR(1000) NOT NULL,
    [plant_equipment] NVARCHAR(1000) NOT NULL,
    [breakdown_description] NVARCHAR(1000) NOT NULL,
    [notes] NVARCHAR(1000),
    [userId] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 CONSTRAINT [downtime_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 CONSTRAINT [downtime_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [downtime_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [downtime_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[deleted_downtime] (
    [id] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [deleted_downtime_status_df] DEFAULT 'down',
    [start_date] NVARCHAR(1000) NOT NULL,
    [end_date] NVARCHAR(1000),
    [plant_category] NVARCHAR(1000) NOT NULL CONSTRAINT [deleted_downtime_plant_category_df] DEFAULT 'Plant Outage',
    [plant_section] NVARCHAR(1000) NOT NULL,
    [discipline] NVARCHAR(1000) NOT NULL,
    [plant_equipment] NVARCHAR(1000) NOT NULL,
    [breakdown_description] NVARCHAR(1000) NOT NULL,
    [notes] NVARCHAR(1000),
    [userId] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 CONSTRAINT [deleted_downtime_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 CONSTRAINT [deleted_downtime_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [deleted_downtime_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [deleted_downtime_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[deleted_user] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [identifier] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 CONSTRAINT [deleted_user_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 CONSTRAINT [deleted_user_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [deleted_user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [deleted_user_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[audit_log] (
    [id] NVARCHAR(1000) NOT NULL,
    [action] NVARCHAR(1000) NOT NULL,
    [entity_type] NVARCHAR(1000) NOT NULL,
    [entity_id] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [metadata] NVARCHAR(1000),
    [userId] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [audit_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [audit_log_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [audit_log_id_key] UNIQUE NONCLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[downtime] ADD CONSTRAINT [downtime_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[deleted_downtime] ADD CONSTRAINT [deleted_downtime_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[deleted_user] ADD CONSTRAINT [deleted_user_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[audit_log] ADD CONSTRAINT [audit_log_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
