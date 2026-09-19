import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto{

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    password!: string;
}