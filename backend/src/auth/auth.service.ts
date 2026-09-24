import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { db } from '../database/db';
import { eq } from 'drizzle-orm';
import { roles, userRoles, users } from '../database/schema';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Register user
  async register(dto: RegisterDto) {
    //checking the user is already exists
    const { email } = dto;
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists!');
    }
    //password hashed for storing database instead for raw password
    const passwordHash = await bcrypt.hash(dto.password, 12);
    // inserting user into database
    const user = await db
      .insert(users)
      .values({
        email: dto.email,
        name: dto.name,
        passwordHash,
      })
      .returning();

    //destructuring the user
    const [createdUser] = user;

    // find the customer
    const customerRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'customer'),
    });

    if (!customerRole) {
      throw new InternalServerErrorException('Customer role not found');
    }

    // adding the role 
    await db.insert(userRoles).values({
      userId: createdUser.id,
      roleId: customerRole.id,
    });
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

  //Login user
  async login(dto: LoginDto) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, dto.email),
    });
    if (!user) {
      throw new UnauthorizedException('Invaild Email or Password');
    }
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invaild email or password');
    }

    // Creating accesstoken with shorter lifespan
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    // Creating refresh token with more lifespan
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: '7d' },
    );

    // hashing refresh token to store
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await db
      .update(users)
      .set({ refreshTokenHash })
      .where(eq(users.id, user.id));

    return {
      accessToken,
      refreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Refresh token
  async refresh(dto: RefreshTokenDto) {
    const payload = await this.jwtService.verifyAsync(dto.refreshToken);

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub),
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException('Token not found');
    }

    const isValid = await bcrypt.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );

    if (!isValid) {
      throw new UnauthorizedException('Token is not valid');
    }

    const newAccessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    const newRefreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: '7d' },
    );

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
    await db
      .update(users)
      .set({ refreshTokenHash: newRefreshTokenHash })
      .where(eq(users.id, user.id));

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  //Logout
  async logout(userId: string) {
    await db
      .update(users)
      .set({ refreshTokenHash: null })
      .where(eq(users.id, userId));

    return { message: 'Logged out successfully' };
  }
}
