import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body('phone') phone: string) {
    return this.authService.sendCode(phone);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.phone, body.code, body.region, body.district, body.full_name);
  }
}