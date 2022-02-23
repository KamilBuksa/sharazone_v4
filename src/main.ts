import {NestFactory, } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    // transformuje createArticleDto na instancję klasy CreateArticleDto
    transform:true,
  }))

  //TEST
  app.connectMicroservice({
    transport:Transport.TCP,
    options:{
      port:3000
    }
  })
  //TEST


  await app.startAllMicroservices()

  await app.listen(3000);
}
bootstrap();
