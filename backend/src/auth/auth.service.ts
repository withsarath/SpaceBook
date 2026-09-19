import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { db } from '../database/db';
import { eq } from 'drizzle-orm';
import { users } from '../database/schema';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    const { email } = dto;
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists!');
    }
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await db
      .insert(users)
      .values({
        email: dto.email,
        name: dto.name,
        passwordHash,
      })
      .returning();
    const [createdUser] = user;
    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone,
      isActive: createdUser.isActive,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }

  async login(dto: LoginDto) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, dto.email),
    });
    if (!user) {
      throw new UnauthorizedException('Invaild Email or Password');
    }
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash)

    if(!isMatch){
        throw new UnauthorizedException('Invaild email or password')
    }
    return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
};
  }
}