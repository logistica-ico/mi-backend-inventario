import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('check-status')
  @UseGuards(AuthGuard())
  checkStatus(@Req() req: any) {
    return req.user;
  }
 @Post('register')
  register(@Body() createUserDto: any) {
    return this.authService.create(createUserDto);
}
