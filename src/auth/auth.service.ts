import {Injectable} from '@nestjs/common';
import {AuthDto} from "./dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Auth} from "./entities/auth.entity";
import {Repository} from "typeorm";
import * as bcrypt from "bcrypt";
import {Tokens} from "./types";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>,
        private readonly jwtService: JwtService
    ) {
    }

    async signupLocal(dto: AuthDto): Promise<Tokens> {
        const hash = await this.hashData(dto.password)
        const newUser = await this.authRepository.save({
            email: dto.email,
            hash
        })


        const tokens = await this.geTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token)
        return tokens
    }
    signinLocal() {
    }

    logout() {
    }

    refreshToken() {
    }


    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt)
        await this.authRepository.createQueryBuilder()
            .update()
            .set({hashedRt: rt})
            .where({id: userId})
            .execute()

    }

    hashData(data: string) {
        return bcrypt.hash(data, 10)
    }

    async geTokens(userId: number, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: 'at-secret',
                expiresIn: 60 * 15,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: 'rt_secret',
                expiresIn: 60 * 60 * 24 * 7,
            })

        ])

        return {
            access_token: at,
            refresh_token: rt
        }
    }


}
