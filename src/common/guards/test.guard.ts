import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TestGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    request.user =request

    //

    //@TODO stworzyć walidację (?)
    // if(request){
    //   request['payload'] = 'some custom value'
    // }
    //
    // console.log(request);

    // return authHeader === process.env.API_KEY;

    return true
  }
}