/*
  Warnings:

  - You are about to drop the column `openHostProxy` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserSettings` DROP COLUMN `openHostProxy`,
    ADD COLUMN `openAiHostProxy` VARCHAR(191) NULL;
