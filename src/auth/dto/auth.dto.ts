import {IsDate, IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Unique} from "typeorm";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string


    // @IsString()
    // hash: string
    //
    // @IsString()
    // hashedRt?: string
}
