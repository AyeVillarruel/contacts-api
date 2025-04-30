/*
  Warnings:

  - You are about to drop the column `address` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `phones` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `city` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_personal` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contact` DROP COLUMN `address`,
    DROP COLUMN `phones`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_personal` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_work` VARCHAR(191) NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL;
