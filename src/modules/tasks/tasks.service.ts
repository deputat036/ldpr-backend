import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  async getAll() {
    // Если задач нет, создадим тестовую
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.save({ title: 'Тестовая задача', description: 'Описание', reward: 100 });
    }
    return this.repo.find();
  }
}