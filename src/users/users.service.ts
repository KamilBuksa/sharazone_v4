import { Injectable } from '@nestjs/common';
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {
constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>
) {
}
    private users:CreateUserDto[] = [{
        userId:2,
        password:'haslo',
        username:'imie'
    }]

    create(createUserDto:CreateUserDto){
    const user = this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
    }

}
