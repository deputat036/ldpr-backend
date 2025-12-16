import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private authCodes = new Map<string, string>(); // Телефон -> Код

  constructor(private usersService: UsersService, private jwt: JwtService) {}

  async sendCode(phone: string) {
    // Генерируем последние 4 цифры (это и будет код)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.authCodes.set(phone, code);
    
    // Генерируем случайный "номер бота", с которого якобы идет звонок
    const botNumber = `+7900${Math.floor(100 + Math.random() * 900)}${code}`;

    // !!! ЭМУЛЯЦИЯ ЗВОНКА (БЕСПЛАТНО) !!!
    // В консоли Render или VS Code вы увидите это сообщение
    console.log(`=============================================`);
    console.log(`>>> ЗВОНОК НА ${phone}`);
    console.log(`>>> ВХОДЯЩИЙ НОМЕР: ${botNumber}`);
    console.log(`>>> КОД ДЛЯ ВХОДА:  ${code}`);
    console.log(`=============================================`);
    
    // В реальности здесь подключается API (например, sms.ru или zvonok.com)
    
    return { message: 'Ждите звонка' };
  }

  async login(phone: string, code: string, region?: string, district?: string, fullName?: string) {
    const validCode = this.authCodes.get(phone);
    
    // Оставляем 1234 как универсальный код для удобства тестов
    if (code !== '1234' && code !== validCode) {
      throw new BadRequestException('Неверные 4 цифры');
    }

    let user = await this.usersService.findByPhone(phone);

    if (!user) {
      if (!region || !district || !fullName) {
        return { status: 'need_register' };
      }
      user = await this.usersService.create(phone, fullName, region, district);
    }

    if (user.is_blocked) throw new BadRequestException('Аккаунт заблокирован');

    this.authCodes.delete(phone);
    return { 
      access_token: this.jwt.sign({ sub: user.id, role: user.role }),
      user: user 
    };
  }
}