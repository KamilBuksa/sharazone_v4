import { Module } from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {UsersService} from "../users/users.service";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports:[TypeOrmModule.forFeature([User]), ConfigModule],
    controllers: [AuthController],
    providers: [AuthService,UsersService]
})
export class AuthModule {

}
