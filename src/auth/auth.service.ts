import {Injectable} from '@nestjs/common';
import {AuthDto} from "./dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Auth} from "./entities/auth.entity";
import {Repository} from "typeorm";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>
    ) {
    }


     signupLocal(dto: AuthDto) {
        const newUser =  this.authRepository.create(dto)
        return this.authRepository.save(newUser)
    }

    signinLocal() {
    }

    logout() {
    }

    refreshToken() {
    }
}
