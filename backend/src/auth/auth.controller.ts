import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import type { Request } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController{
    constructor(private readonly authservice: AuthService){}


    @Post('register')
    async register(@Body() dto: RegisterDto){
        return await this.authservice.register(dto)
    }

   
    @Post('login')
    async login(@Body() dto: LoginDto){
        return await this.authservice.login(dto)
    }
    
    // only authenticated users can access this route
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req: Request){
        return req.user;
    }
}