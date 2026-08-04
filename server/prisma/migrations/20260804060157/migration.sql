/*
  Warnings:

  - You are about to drop the column `data` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "data",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sessions_userId_key" ON "sessions"("userId");
