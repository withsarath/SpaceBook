import { IsNotEmpty, IsString } from "class-validator";

export class RejectOwnerApplicationDto{

    @IsString()
    @IsNotEmpty()
    reason!: string
}