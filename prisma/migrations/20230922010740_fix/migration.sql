/*
  Warnings:

  - The primary key for the `SubmissionField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SubmissionField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubmissionField" DROP CONSTRAINT "SubmissionField_pkey",
DROP COLUMN "id";
