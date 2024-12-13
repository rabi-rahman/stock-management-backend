/*
  Warnings:

  - You are about to drop the column `location` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "location",
DROP COLUMN "price",
ADD COLUMN     "row" VARCHAR(20),
ALTER COLUMN "name" DROP NOT NULL;
