/*
  Warnings:

  - You are about to alter the column `examDay` on the `Exams` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `Exams` MODIFY `examDay` DATETIME(3) NOT NULL;
