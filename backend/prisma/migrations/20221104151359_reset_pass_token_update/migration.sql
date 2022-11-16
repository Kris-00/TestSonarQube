/*
  Warnings:

  - Added the required column `email` to the `Reset_Password_Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reset_Password_Tokens" ADD COLUMN     "email" TEXT NOT NULL;
