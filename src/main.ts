import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const conf = app.get(ConfigService);
  const port = await conf.get<number>('PORT', 5000);
  const logger = new Logger('Todo List Application');
  await app.listen(port);
  logger.debug(`Listening on port [${port}]`);
}
bootstrap();
