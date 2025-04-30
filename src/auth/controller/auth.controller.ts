import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { RegisterAuthDto } from '../dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({ description: 'Register a new user and return a token.' })
  async register(@Body() dto: RegisterAuthDto) {
    return this.authService.registerAndLogin(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Login an existing user and return a token.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
