/*
  Warnings:

  - You are about to drop the column `sortingORED` on the `Trigger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "sortingORED",
ADD COLUMN     "sortingOrder" INTEGER NOT NULL DEFAULT 0;
