/*
  Warnings:

  - You are about to alter the column `date` on the `AcademicTranscripts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `studyTime` on the `Classes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `learningDate` on the `Lessons` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `dob` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `AcademicTranscripts` MODIFY `date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Classes` MODIFY `studyTime` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Lessons` MODIFY `learningDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Users` MODIFY `dob` DATETIME(3) NOT NULL;
