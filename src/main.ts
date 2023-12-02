import { validationConfig } from './config/validation.config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SessionMiddleware } from './middlewares/session.middleware';
import { SwaggerMiddleware } from './middlewares/swagger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  
  SessionMiddleware(app);
  SwaggerMiddleware(app);


  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();