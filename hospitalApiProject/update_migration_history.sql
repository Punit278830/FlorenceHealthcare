-- SQL commands to manually update the migration history
-- Run these commands in your production database to mark all migrations as applied

-- First, create the migrations history table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[__EFMigrationsHistory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

-- Insert migration records to mark them as applied
-- Since you already have the tables and columns, we mark all migrations as applied

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20240928094954_AddPaymentModeInfoTable', '8.0.3');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20250712030601_ManualDateOnlyToDateTimeMigration', '8.0.3');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20250713012542_AddSoftDeleteToAppointmentAndInvoice', '8.0.3');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20250713013608_RemoveDeletedByColumns', '8.0.3');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20250713014308_AddNullableSoftDeleteColumns', '8.0.3');

-- Verify the migrations are now marked as applied
SELECT * FROM [__EFMigrationsHistory] ORDER BY [MigrationId];
