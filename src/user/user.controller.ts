import { Controller, Get, Post, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('user')
@UseGuards(AuthGuard('jwt')) // Aseguramos que el usuario esté autenticado PRIMERO
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('dashboard-config')
  getDashboardConfig() {
    return this.userService.getDashboardConfig();
  }

  @Post('dashboard-config')
  saveDashboardConfig(@Body() body: any) {
    return this.userService.saveDashboardConfig(body);
  }
}
