import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOwnerApplicationDto {
  @IsString()
  @IsNotEmpty()
  businessName!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
