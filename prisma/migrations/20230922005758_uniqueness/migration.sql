/*
  Warnings:

  - A unique constraint covering the columns `[submissionId,fieldId,anonymousId]` on the table `SubmissionField` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anonymousId` to the `SubmissionField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmissionField" ADD COLUMN     "anonymousId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionField_submissionId_fieldId_anonymousId_key" ON "SubmissionField"("submissionId", "fieldId", "anonymousId");
