import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBirthdayNotification(userId: string, contactId: string, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        contactId,
        message,
      },
    });
  }
  

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        contact: {
          userId,
        },
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        contact: {
          userId,
        },
        read: false,
      },
      data: {
        read: true,
      },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        contact: {
          userId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}