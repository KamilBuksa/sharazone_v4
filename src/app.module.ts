import {Module} from '@nestjs/common';
import {ArticlesModule} from './articles/articles.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from './auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import appConfig from './config/app.config';
import { PhotosModule } from './photos/photos.module';
import { JwtService } from '@nestjs/jwt';


@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig], // 👈
        }),
        TypeOrmModule.forRootAsync({ // 👈
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: process.env.DATABASE_HOST,
                port: +process.env.DATABASE_PORT,
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        ArticlesModule,
        AuthModule,
        PhotosModule,
        ],
})
export class AppModule {
}

