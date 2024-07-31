-- AlterTable
ALTER TABLE `UserSettings` ADD COLUMN `supportVisual` BOOLEAN NULL,
    ADD COLUMN `systemPrompt` VARCHAR(191) NULL,
    ADD COLUMN `temperature` DOUBLE NULL DEFAULT 0.6;
