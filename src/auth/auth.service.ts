import {ForbiddenException, Injectable, Req} from '@nestjs/common';
import {AuthDto} from "./dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Auth} from "./entities/auth.entity";
import * as argon from 'argon2';
import {Repository} from "typeorm";
import {Tokens} from "./types";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>,
        private readonly jwtService: JwtService
    ) {
    }

    async signupLocal(dto: AuthDto): Promise<Tokens> {
        const hash = await argon.hash(dto.password)
        const newUser = await this.authRepository.save({
            email: dto.email,
            hash
        })
        const tokens = await this.geTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token)


        return tokens
    }

    async  signinLocal(dto: AuthDto): Promise<Tokens> {
        //metoda findUserByEmail
        const data = await this.authRepository.createQueryBuilder().where({email: dto.email});
        const userEmail = data.expressionMap.parameters.orm_param_0;

        const user = await this.authRepository.findOne({email: userEmail});
        if (!user) throw new ForbiddenException("Access Denied!");

        const passwordMatches = await argon.verify(user.hash, dto.password);
        if (!passwordMatches) throw new ForbiddenException("Access Denied!");

        const tokens = await this.geTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);


        return tokens

    }

    async logout(req: Request):Promise<boolean>  {
        const barerToken = req.headers.authorization;
        const token = barerToken.substring(7, barerToken.length)
        const decoded = this.jwtService.decode(token, {complete: true});
        const payloadSub = decoded['payload'].sub;

      await this.authRepository.createQueryBuilder()
            .update()
            .set({hashedRt: null})
            .where({
                id: payloadSub,
                // hashedRt: {not: null}   ,  coś z tym nie działa(?)
            })
            .execute()

        return true
    }

    refreshToken() {
    }


    async updateRtHash(userId: number, rt: string) {
        const hash = await argon.hash(rt)
        await this.authRepository.createQueryBuilder()
            .update()
            .set({hashedRt: hash})
            .where({id: userId})
            .execute()
    }


    async geTokens(userId: number, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: process.env.REFRESH_SECRET_TOKEN,
                // secret: 'at-secret',
                expiresIn: 60 * 15,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: process.env.REFRESH_SECRET_TOKEN,
                // secret: 'rt_secret',
                expiresIn: 60 * 60 * 24 * 7,
            })

        ])

        return {
            access_token: at,
            refresh_token: rt
        }
    }


//     getPayloadFromToken(@Req() req: Request): any {
//         this.jwt.signAsync({}, {opts})
//         const barerToken = req.headers.authorization;
//         const token = barerToken.substring(7, barerToken.length)
//
//         const decoded = this.jwtService.decode(token, {complete: true});
//         console.log(barerToken)
//         return decoded
//     }
}
