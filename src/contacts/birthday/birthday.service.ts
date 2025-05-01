import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContactsService } from '../service/contacts.service';
import { NotificationService } from 'src/notifications/service/notifications.service';

@Injectable()
export class BirthdayCheckService {
  private readonly logger = new Logger(BirthdayCheckService.name);

  constructor(
    private readonly contactsService: ContactsService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleBirthdayCheck() {
    this.logger.log('🔔 Running birthday check...');
  
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; 
  
    const contacts = await this.contactsService.findContactsByBirthday(day, month);
  
    for (const contact of contacts) {
      this.logger.log(`Contact ${contact.name} is having a birthday!`);
      await this.notificationService.createBirthdayNotification(
        contact.userId,
        contact.id,
        `Hoy es el cumpleaños de ${contact.name}!`
      );
    }
  
    if (contacts.length === 0) {
      this.logger.log('No birthdays today.');
    }
  }
  
}
