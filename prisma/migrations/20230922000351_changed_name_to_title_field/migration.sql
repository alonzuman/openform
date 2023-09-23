/*
  Warnings:

  - You are about to drop the column `name` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Field" DROP COLUMN "name",
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "name",
ADD COLUMN     "title" TEXT;
