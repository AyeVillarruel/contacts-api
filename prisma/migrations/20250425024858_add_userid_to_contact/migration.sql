/*
  Warnings:

  - Added the required column `userId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Made the column `company` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Contact_email_key` ON `Contact`;

-- AlterTable
ALTER TABLE `Contact` ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `company` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
