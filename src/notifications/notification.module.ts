import { Module } from '@nestjs/common';
import { NotificationRepository } from './repository/notification.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationController } from './controller/notifications.controller';
import { NotificationService } from './service/notifications.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}