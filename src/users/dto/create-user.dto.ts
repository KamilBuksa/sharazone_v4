import {IsDate, IsNumber, IsString} from "class-validator";

export type OmitPassword = Omit<CreateUserDto, "password">
export type OmitUserId = Omit<CreateUserDto, "userId">

export class CreateUserDto {

    @IsString()
    createdAt: string

    @IsString()
    updatedAt?:string

    @IsString()
    email: string

    @IsString()
    hash:string

    @IsString()
    hashedRt?:string


}
