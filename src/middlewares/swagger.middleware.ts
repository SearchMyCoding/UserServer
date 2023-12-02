import { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { SwaggerConfig, SwaggerPath } from "src/config/swagger.config";

export function SwaggerMiddleware(app: INestApplication){
    const document = SwaggerModule.createDocument(app, SwaggerConfig);
    SwaggerModule.setup(SwaggerPath, app, document);
}