import { Module } from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {UsersService} from "../users/users.service";
import {ConfigModule} from "@nestjs/config";
import {Auth} from "./entities/auth.entity";
import {AtStrategy, RtStrategy} from "./strategies";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports:[TypeOrmModule.forFeature([User,Auth]), ConfigModule, JwtModule.register({}),],
    controllers: [AuthController],
    providers: [AuthService,UsersService,AtStrategy,RtStrategy]
})
export class AuthModule {

}
