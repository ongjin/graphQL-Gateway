import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NODE_PORT } from './shared';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: true,
            credentials: true,
        }
    });
    await app.listen(NODE_PORT);
}
bootstrap();


