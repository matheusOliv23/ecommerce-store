/*
  Warnings:

  - You are about to drop the column `numberOfReviews` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "numberOfReviews",
ADD COLUMN     "numReviews" INTEGER NOT NULL DEFAULT 0;
