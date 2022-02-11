import {Module} from '@nestjs/common';
import {ArticlesController} from "./articles.controller";
import {ArticlesService} from "./articles.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Article} from "./entities/article.entity";
import {ConfigModule} from "@nestjs/config";
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from 'src/auth/strategies';

@Module({
    imports: [TypeOrmModule.forFeature([Article]), ConfigModule, JwtModule.register({})],
    controllers: [ArticlesController],
    providers: [ArticlesService, AtStrategy, RtStrategy]
})
export class ArticlesModule {
}
