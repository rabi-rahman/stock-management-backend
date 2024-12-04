/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_productId_fkey";

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "location" VARCHAR(255);

-- DropTable
DROP TABLE "Location";
