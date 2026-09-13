/*
  Warnings:

  - You are about to drop the column `url` on the `files` table. All the data in the column will be lost.
  - Added the required column `Size` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadTime` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "url",
ADD COLUMN     "Size" INTEGER NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "uploadTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "last_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
