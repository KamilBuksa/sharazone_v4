import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { AuthDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthRepository } from './auth.repository.service';

@Injectable()
export class AuthService extends AuthRepository {
  constructor(
    @InjectRepository(Auth)
    protected readonly authRepository: Repository<Auth>,
    protected readonly jwtService: JwtService,
  ) {
    super(authRepository, jwtService);
  }

  async signupLocal(dto: AuthDto): Promise<Tokens> {
     return this._signupLocal(dto)
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    return this._signinLocal(dto);
  }

  async logout(req: Request): Promise<boolean> {
    return this._logout(req);
  }

  refreshToken() {
  }


}
