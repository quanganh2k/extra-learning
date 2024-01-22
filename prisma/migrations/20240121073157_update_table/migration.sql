/*
  Warnings:

  - You are about to drop the column `fromTime` on the `Lessons` table. All the data in the column will be lost.
  - You are about to drop the column `toTime` on the `Lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Lessons` DROP COLUMN `fromTime`,
    DROP COLUMN `toTime`,
    ADD COLUMN `endHour` DATETIME(3) NULL,
    ADD COLUMN `startHour` DATETIME(3) NULL;
