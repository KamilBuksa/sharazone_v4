import {Module} from '@nestjs/common';
import {ArticlesController} from "./articles.controller";
import {ArticlesService} from "./articles.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Article} from "./entities/article.entity";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [TypeOrmModule.forFeature([Article]), ConfigModule],
    controllers: [ArticlesController],
    providers: [ArticlesService]
})
export class ArticlesModule {
}
