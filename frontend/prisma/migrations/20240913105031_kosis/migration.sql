/*
  Warnings:

  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Friend` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Friend_friendId_idx";

-- AlterTable
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Friend_pkey" PRIMARY KEY ("id");
