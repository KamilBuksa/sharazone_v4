import { IsNotEmpty, IsString} from "class-validator";

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
