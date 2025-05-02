import { Module } from '@nestjs/common';
import { ContactsModule } from '../contacts.module';
import { NotificationModule } from '../../notifications/notification.module';
import { BirthdayCheckService } from './birthday.service';

@Module({
  imports: [ContactsModule, NotificationModule, BirthdayCheckService],
  providers: [BirthdayCheckService],
})
export class BirthdayModule {}
