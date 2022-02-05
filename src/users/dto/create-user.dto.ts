import { IsNumber, IsString } from "class-validator";
export type OmitPassword= Omit<CreateUserDto, "password">
export type OmitUserId= Omit<CreateUserDto, "userId">

export class CreateUserDto {

    @IsNumber()
    userId:  number;


    @IsString()
    username: string;

    @IsString()
    password: string;
}
