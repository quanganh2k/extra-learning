/*
  Warnings:

  - You are about to drop the column `endHour` on the `Lessons` table. All the data in the column will be lost.
  - You are about to drop the column `startHour` on the `Lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Lessons` DROP COLUMN `endHour`,
    DROP COLUMN `startHour`;
