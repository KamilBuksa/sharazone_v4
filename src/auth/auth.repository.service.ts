import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// AuthService ma być zapisany jako rozszerzenie AuthRepository, tak by metody były w AuthRepository a w AuthService wywołania
@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    public  authRepository: Repository<Auth>,
    public  jwtService: JwtService,
  ) {

  }

  async log(req:Request):Promise<any> {
    console.log('działa');
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
}
