/*
  Warnings:

  - Added the required column `code` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "code" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
