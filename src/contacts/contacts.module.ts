import { Module} from '@nestjs/common';
import { CacheModule} from '@nestjs/cache-manager';
import { ContactsService } from './service/contacts.service';
import { ContactsController } from './controller/contacts.controller';
import { ContactsRepository } from './repository/contacts.repository';
import { NotificationService } from 'src/notifications/service/notifications.service';
import { NotificationModule } from 'src/notifications/notification.module';
import { S3Service } from 'src/common/services/s3.service';
import { BirthdayCheckService } from './birthday/birthday.service';

@Module({
  imports: [CacheModule.register(), NotificationModule],
  controllers: [ContactsController],
  providers: [ContactsService, ContactsRepository, BirthdayCheckService, NotificationService, S3Service],
})
export class ContactsModule {}