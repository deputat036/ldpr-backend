import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  // Создание задачи (только для координаторов/админов)
  async create(taskData: Partial<Task>, creator: User) {
    // Если создает координатор, он может ставить задачи только в своем регионе
    if (creator.role === 'coordinator') {
      taskData.region = creator.region;
      // Если координатор района - то только в район
      if (creator.district) taskData.district = creator.district;
    }
    return this.repo.save(taskData);
  }

  // Получение задач (фильтр для активиста)
  async getForUser(user: User) {
    return this.repo.createQueryBuilder('task')
      .where('task.region IS NULL') // Федеральные задачи
      .orWhere('task.region = :region AND task.district IS NULL', { region: user.region }) // Региональные
      .orWhere('task.region = :region AND task.district = :district', { region: user.region, district: user.district }) // Местные
      .getMany();
  }
}