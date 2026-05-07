import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from './entities/user.entity';
import { UserSetting } from './entities/user-setting.entity';
import { CreateUserDto } from './dto/user.dto';
import { DashboardConfigDto } from './dto/dashboard-config.dto';

const DASHBOARD_KEY = 'dashboard_config';
const DEFAULT_DASHBOARD = [
  { id: 'total-p', type: 'totalProducts', title: 'Productos', colorClass: 'bg-blue-50 text-blue-600' },
  { id: 'low-s', type: 'lowStock', title: 'Stock Bajo', colorClass: 'bg-amber-50 text-amber-600' },
  { id: 'out-s', type: 'outOfStock', title: 'Sin Stock', colorClass: 'bg-rose-50 text-rose-600' },
];

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserSetting)
    private readonly settingRepo: Repository<UserSetting>,
  ) {}

  // ─── AUTH & USERS ──────────────────────────────────────────────────────────
  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const existingUser = await this.userRepo.findOne({ where: { email: userData.email } });
    if (existingUser) throw new ConflictException('El correo ya está registrado');

    const user = this.userRepo.create({
      id: uuidv4(),
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });

    await this.userRepo.save(user);
    const { password: _, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'fullName', 'role', 'isActive'],
    });
  }

  async findAll() {
    return this.userRepo.find({ 
      select: ['id', 'email', 'fullName', 'role', 'isActive', 'createdAt'],
      order: { createdAt: 'DESC' } 
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // ─── DASHBOARD CONFIG ──────────────────────────────────────────────────────
  async getDashboardConfig(): Promise<any[]> {
    const setting = await this.settingRepo.findOne({ where: { key: DASHBOARD_KEY } });
    if (!setting) return DEFAULT_DASHBOARD;
    return JSON.parse(setting.value);
  }

  async saveDashboardConfig(dto: DashboardConfigDto): Promise<any[]> {
    let setting = await this.settingRepo.findOne({ where: { key: DASHBOARD_KEY } });
    if (!setting) {
      setting = this.settingRepo.create({ key: DASHBOARD_KEY, value: '' });
    }
    setting.value = JSON.stringify(dto.config);
    await this.settingRepo.save(setting);
    return dto.config;
  }
}
