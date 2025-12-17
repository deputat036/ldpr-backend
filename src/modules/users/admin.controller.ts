import { Controller, Get, Put, Param, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUsers(@Req() req) {
    const userId = req.user.sub || req.user.userId;
    const currentUser = await this.usersService.findById(userId);
    
    // Исправление ошибки: проверяем, что юзер существует
    if (!currentUser) throw new BadRequestException('Пользователь не найден');
    
    if (currentUser.role === 'activist') return []; 
    return this.usersService.getActivists(currentUser);
  }

  @Put('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Param('id') id: string, @Body() body) {
    return this.usersService.updateUser(id, body);
  }
}