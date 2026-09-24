import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authservice.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authservice.login(dto);
  }

  // only authenticated users can access this route
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    return req.user;
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return await this.authservice.refresh(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
      };
    },
  ) {
    const user = req.user;
    return await this.authservice.logout(user.userId);
  }

}
