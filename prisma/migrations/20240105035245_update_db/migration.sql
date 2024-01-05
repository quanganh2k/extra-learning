/*
  Warnings:

  - You are about to drop the column `endTime` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `learningTime` on the `Lessons` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Classes` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`,
    MODIFY `studyTime` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Lessons` DROP COLUMN `learningTime`,
    ADD COLUMN `endTime` DATETIME(3) NOT NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL;
