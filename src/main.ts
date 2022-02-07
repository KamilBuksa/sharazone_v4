import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import passport, {session} from "passport";
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    // transformuje createArticleDto na instancję klasy CreateArticleDto
    transform:true,
  }))

  await app.listen(3000);
}
bootstrap();
