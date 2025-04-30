import { Module } from '@nestjs/common';
import { ContactsModule } from 'src/contacts/contacts.module';
import { NotificationModule } from 'src/notifications/notification.module';
import { BirthdayCheckService } from './birthday.service';

@Module({
  imports: [ContactsModule, NotificationModule, BirthdayCheckService],
  providers: [BirthdayCheckService],
})
export class BirthdayModule {}
