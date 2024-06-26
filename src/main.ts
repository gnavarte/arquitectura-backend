import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(process.env.PORT || 3000);
  logger.log(`Application listening on port ${process.env.PORT || 3000}`);
}
bootstrap();
