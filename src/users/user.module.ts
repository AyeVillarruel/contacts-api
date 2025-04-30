import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UsersModule {}
