/*
  Warnings:

  - Added the required column `postal_code` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT DEFAULT '',
ADD COLUMN     "postal_code" INTEGER NOT NULL;
