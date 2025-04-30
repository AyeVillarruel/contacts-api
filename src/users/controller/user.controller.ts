import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@User('userId') userId: string,) {
    return this.userService.getProfile(userId);
  }

  @Patch()
  async updateUser(@User('userId') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
