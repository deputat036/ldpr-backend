import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
// Проверь этот путь. Обычно Guard лежит в папке auth.
// Если файл называется иначе или лежит в другом месте, поправь импорт.
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('tasks')
export class TasksController {
  constructor(private service: TasksService) {}

  @UseGuards(JwtAuthGuard) // Обязательно: проверяем токен
  @Get()
  getTasks(@Request() req) {
    // req.user автоматически заполняется благодаря JwtAuthGuard
    return this.service.getForUser(req.user);
  }
}