/*
  Warnings:

  - You are about to drop the column `rating` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "rating";

-- CreateIndex
CREATE UNIQUE INDEX "Book_title_key" ON "Book"("title");
