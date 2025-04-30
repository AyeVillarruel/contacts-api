import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    return this.userRepo.update(userId, dto);
  }
}
