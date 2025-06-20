/*
  Warnings:

  - Added the required column `name` to the `Singup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Singup" ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);
