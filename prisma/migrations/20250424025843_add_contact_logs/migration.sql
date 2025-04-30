-- CreateTable
CREATE TABLE `ContactLog` (
    `id` VARCHAR(191) NOT NULL,
    `contactId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `field` VARCHAR(191) NULL,
    `oldValue` VARCHAR(191) NULL,
    `newValue` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContactLog` ADD CONSTRAINT `ContactLog_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
