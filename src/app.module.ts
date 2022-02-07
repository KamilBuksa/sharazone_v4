import {Module} from '@nestjs/common';
import {ArticlesModule} from './articles/articles.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import appConfig from './config/app.config';
import {AtStrategy, RtStrategy} from "./auth/strategies";


@Module({
    imports: [
        ArticlesModule,
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
        ConfigModule,
        AuthModule,
        UsersModule],
    controllers: [],
    providers: [AtStrategy,RtStrategy],
})
export class AppModule {
}

// AuthController, UsersController
// AuthService, UsersService