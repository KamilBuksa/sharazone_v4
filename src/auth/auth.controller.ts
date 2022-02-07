import {
    Body,
    Controller,
    createParamDecorator,
    ExecutionContext,
    Get,
    HttpCode,
    HttpStatus, Inject, Injectable,
    Post,
    Req, Scope,
    UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Repository} from "typeorm";
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types";
import {AuthGuard, PassportModule} from "@nestjs/passport";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
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


    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout( @Req() req:Request) {
        const user = req.user['sub'];
        return await this.authService.logout(user)
    }



    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshToken() {
        // this.authService.refreshToken()
    }


}
