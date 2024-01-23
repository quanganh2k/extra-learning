/*
  Warnings:

  - Added the required column `month` to the `AcademicTranscripts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AcademicTranscripts` ADD COLUMN `classId` INTEGER NULL,
    ADD COLUMN `month` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `AcademicTranscripts` ADD CONSTRAINT `AcademicTranscripts_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
