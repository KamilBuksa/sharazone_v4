import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Auth} from "../auth/entities/auth.entity";

@Injectable()
export class UsersService {
constructor(
    @InjectRepository(Auth)
    private readonly authRepository:Repository<Auth>
) {
}
    // async create(data){
    //     console.log('DATAAaa', data);
    //     return this.authRepository.save(data)
    // }

}
