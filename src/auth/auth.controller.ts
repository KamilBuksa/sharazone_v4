import {Body, Controller, Get, Post} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Repository} from "typeorm";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService:UsersService
    ) {
    }

@Get('hello')
hello(){
    console.log('hello')
    return 'hello'
}

@Post()
    sendDate(@Body() createUserDto:CreateUserDto){
   return this.userService.create(createUserDto)

}

}
