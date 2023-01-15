import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //register DI container for creating custom validators with class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
