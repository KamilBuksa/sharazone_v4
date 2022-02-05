import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [ArticlesModule,
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    autoLoadEntities: true,
    synchronize: true, // your entities will be synced with the database(recommended: disable in prod)
  }),
    AuthModule,
    UsersModule],
  controllers: [AppController,],
  providers: [AppService, ],
})
export class AppModule {}

// AuthController, UsersController
// AuthService, UsersService