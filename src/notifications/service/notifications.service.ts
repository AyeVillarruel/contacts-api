import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}
  

  async createNotification(
    userId: string,
    contactId: string,
    type: NotificationType,
    message: string,
  ) {
    return this.notificationRepo.createNotification(userId, contactId, type, message);
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepo.getUserNotifications(userId);
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepo.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.notificationRepo.deleteNotification(notificationId, userId);
  }
}
