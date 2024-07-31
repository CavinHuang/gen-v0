/*
  Warnings:

  - Made the column `supportVisual` on table `UserSettings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `systemPrompt` on table `UserSettings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `UserSettings` MODIFY `supportVisual` BOOLEAN NOT NULL,
    MODIFY `systemPrompt` LONGTEXT NOT NULL;
