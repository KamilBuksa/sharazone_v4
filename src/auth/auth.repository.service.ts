import {Injectable} from "@nestjs/common";

// AuthService ma być zapisany jako rozszerzenie AuthRepository, tak by metody były w AuthRepository a w AuthService wywołania
@Injectable()
export class AuthRepository{}
