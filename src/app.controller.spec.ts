import { Controller, Get, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private usersService: UsersService 
  ) {}

  // Получить задачи (только свои)
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getTasks(@Req() req) {
    // Получаем ID пользователя из токена
    const userId = req.user.sub || req.user.userId;
    const user = await this.usersService.findById(userId);
    
    if (!user) return []; 
    
    // ВАЖНО: вызываем getForUser, а не getAll
    return this.tasksService.getForUser(user);
  }

  // Создать задачу (Только для Админа/Координатора)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body, @Req() req) {
    const userId = req.user.sub || req.user.userId;
    const user = await this.usersService.findById(userId);

    if (!user) throw new BadRequestException('Пользователь не найден');
    if (user.role === 'activist') throw new BadRequestException('Нет прав');

    return this.tasksService.create(body, user);
  }
}