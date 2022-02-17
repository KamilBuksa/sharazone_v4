import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');

    const token = authHeader.substring(7, authHeader.length)
    const decoded = this.jwtService.decode(token, {complete: true});
    const payloadSub = decoded['payload'].sub;
    request.user =payloadSub

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