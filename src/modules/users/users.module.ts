import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { AdminController } from './admin.controller'; // <--- Импортируем новый файл

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminController], // <--- ДОБАВИЛИ ЕГО СЮДА
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}