// import {Injectable, Req} from "@nestjs/common";
// import {Request} from "express";
// import {JwtService} from "@nestjs/jwt";
// import {AuthService} from "../auth.service";
// import {InjectRepository} from "@nestjs/typeorm";
// import {Auth} from "../entities/auth.entity";
// import {Repository} from "typeorm";
//
//
//
// @Injectable()
// export class GetPayload {
//     constructor(private authService: AuthService,
//                 private readonly jwtService: JwtService,
//                 @InjectRepository(Auth)
//                 private readonly authRzzzzepository: Repository<Auth>,
//     ) {
//     }
//
//     getPayloadFromToken(@Req() req: Request): any {
//         const barerToken = req.headers.authorization;
//         const token = barerToken.substring(7, barerToken.length)
//
//         const decoded = this.jwtService.decode(token, {complete: true});
//         console.log(barerToken)
//         return decoded
//     }
// }


//uzyskaj payload by porównać go z payload access_token, i to powinno przepuścić ścieżkę przez Guarda