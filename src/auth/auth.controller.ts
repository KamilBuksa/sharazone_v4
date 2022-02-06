import {Body, Controller, Get, Post} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Repository} from "typeorm";
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ) {}

    @Post('/local/signup')
    signupLocal(@Body() dto:AuthDto) {
        return this.authService.signupLocal(dto)
    }

    @Post('/local/signin')
    signinLocal() {
        this.authService.signinLocal()
    }

    @Post('/logout')
    logout() {
        this.authService.logout()
    }

    @Post('/refresh')
    refreshToken() {
        this.authService.refreshToken()
    }



}
