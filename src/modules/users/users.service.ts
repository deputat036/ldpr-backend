import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByPhone(phone: string) {
    return this.repo.findOne({ where: { phone } });
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(phone: string, fullName: string, region: string, district: string) {
    // Первый пользователь автоматически станет Админом, остальные активистами
    const count = await this.repo.count();
    const role = count === 0 ? 'admin' : 'activist';
    
    const user = this.repo.create({ phone, full_name: fullName, region, district, role });
    return this.repo.save(user);
  }

  // Для админки: получить список активистов (с фильтром для координаторов)
  async getActivists(adminUser: User) {
    if (adminUser.role === 'admin') {
      return this.repo.find(); // Админ видит всех
    }
    if (adminUser.role === 'coordinator') {
      // Координатор видит только свой регион
      return this.repo.find({ where: { region: adminUser.region } });
    }
    return [];
  }

  // Блокировка / Начисление баллов
  async updateUser(id: string, updates: Partial<User>) {
    await this.repo.update(id, updates);
    return this.repo.findOne({ where: { id } });
  }
}