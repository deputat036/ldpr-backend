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

  async create(phone: string) {
    const user = this.repo.create({ phone });
    return this.repo.save(user);
  }
}