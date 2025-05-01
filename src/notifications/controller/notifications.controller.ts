import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { NotificationService } from '../service/notifications.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUserNotifications(@User('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch('read')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  markAllAsRead(@User('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))

  @UseGuards(JwtAuthGuard)
  deleteNotification(@Param('id') id: string, @User('userId') userId: string) {
    return this.notificationService.deleteNotification(id, userId);
  }
}