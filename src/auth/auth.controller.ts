import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import {InjectRepository} from "@nestjs/typeorm";

import {Repository} from "typeorm";
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {Auth} from "./entities/auth.entity";
import {JwtService} from "@nestjs/jwt";


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>,
        private readonly jwtService: JwtService
    ) {
    }

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signupLocal(dto);


    }

    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signinLocal(dto);
    }


    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request) {
         return  this.authService.logout(req)
    }


    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshToken() {
        // this.authService.refreshToken()
    }


}
