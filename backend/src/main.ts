import 'dotenv/config'
import {ConfigService} from "@nestjs/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  
  app.setGlobalPrefix('api/v1/');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}/api/v1`)
}
bootstrap();
