import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwt: JwtService) {}

  async login(phone: string, code: string) {
    // Фейковая проверка SMS. Код всегда 1234
    if (code !== '1234') return null;

    let user = await this.usersService.findByPhone(phone);
    if (!user) user = await this.usersService.create(phone);

    return { access_token: this.jwt.sign({ sub: user.id }) };
  }
}