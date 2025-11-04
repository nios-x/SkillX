/*
  Warnings:

  - Added the required column `desc` to the `Teaching` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skill` to the `Teaching` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teaching" ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "skill" TEXT NOT NULL;
