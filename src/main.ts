import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { config } from 'dotenv';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  await app.listen(3001);
}
bootstrap();
