import {Module} from '@nestjs/common';
import {ArticlesController} from "./articles.controller";
import {ArticlesService} from "./articles.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Article} from "./entities/article.entity";
import {ConfigModule} from "@nestjs/config";
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from 'src/auth/strategies';
import { Auth } from '../auth/entities/auth.entity';
import { AuthService } from '../auth/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [TypeOrmModule.forFeature([Article,Auth]), ConfigModule, JwtModule.register({}),

        ClientsModule.register([
            {
                name: 'PHOTOS',
                transport: Transport.TCP,
                options: {
                    port:3001
                }
            }
        ])
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService,AuthService, AtStrategy, RtStrategy,]
})
export class ArticlesModule {
}
