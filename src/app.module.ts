import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notifications/notification.module';
import { S3Module } from './common/filters/s3.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,ContactsModule, UsersModule,
    NotificationModule,
    S3Module,
    ScheduleModule.forRoot(),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
