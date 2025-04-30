import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repository/auth.repository';
import { RegisterAuthDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registerAndLogin(dto: RegisterAuthDto) {
    await this.register(dto);
    return this.login({ email: dto.email, password: dto.password });
  }

  private async register(dto: RegisterAuthDto) {
    const userExists = await this.authRepo.findByEmail(dto.email);

    if (userExists) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.authRepo.createUser({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.authRepo.findByEmail(dto.email);

    console.log(user)
  
    if (!user) {
      throw new UnauthorizedException('User not exists');
    }
  
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
  
    return { access_token };
  }
  
}
