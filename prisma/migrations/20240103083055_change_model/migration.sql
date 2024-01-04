/*
  Warnings:

  - You are about to alter the column `gender` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `gender` INTEGER NOT NULL;
