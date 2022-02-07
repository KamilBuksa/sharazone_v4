//plik testowy,

// import { createParamDecorator } from '@nestjs/common';
// import {User} from "../users/entities/user.entity";
//
// export const GetUser = createParamDecorator((data, req): User => {
//     return req.user;
// });

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);