import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';

const config : ConfigService = new ConfigService();

export const SwaggerConfig = new DocumentBuilder()
    .addCookieAuth('connect.sid')
    .setTitle('Authorization API')
    .setDescription('Authorization API description')
    .setVersion('0.0.1')
    .build();

export const SwaggerPath = config.get<string>('SWAGGER_PATH');