import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async createBirthdayNotification(userId: string, contactId: string, message: string) {
    return this.notificationRepo.createBirthdayNotification(userId, contactId, message);
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
