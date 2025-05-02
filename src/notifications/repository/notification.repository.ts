import { Injectable } from '@nestjs/common';
import { NotificationType } from 'aws-sdk/clients/budgets';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(
    userId: string,
    contactId: string,
    type: NotificationType,
    message: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        contactId,
        type, 
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
        userId,
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