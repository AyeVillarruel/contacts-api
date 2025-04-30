import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,         
        email: true,
        password: true,
        name: true,
      },
    });
  }
  
  

  async createUser(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({ data });
  }
}
