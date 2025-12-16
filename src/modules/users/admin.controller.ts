import { Controller, Get, Post, Body, UseGuards, Req, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUsers(@Req() req) {
    const currentUser = await this.usersService.findById(req.user.userId);
    if (currentUser.role === 'activist') return []; // Запрет
    return this.usersService.getActivists(currentUser);
  }

  @Put('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Param('id') id: string, @Body() body) {
    // Тут нужна проверка прав (админ может всё, координатор только своих), пока упрощенно
    return this.usersService.updateUser(id, body);
  }
}