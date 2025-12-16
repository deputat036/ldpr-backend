import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { phone: string; code: string }) {
    const result = await this.authService.login(body.phone, body.code);
    if (!result) throw new BadRequestException('Неверный код');
    return result;
  }
}