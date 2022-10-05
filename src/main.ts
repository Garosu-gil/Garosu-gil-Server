import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from '@app/app.module';
import { LoggerService } from '@utils/logger';
import { HttpExceptionsFilter } from '@utils/exceptions';
import { LoggingInterceptor } from '@utils/interceptors/logger.interceptors';
import { TransformInterceptor } from '@utils/interceptors/transform.interceptors';

declare const module: any;

async function create() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  app.getHttpAdapter().getInstance().set('etag', false);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: ['http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionsFilter(new LoggerService()));

  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3000, () => {
    console.log('http://localhost:3000');
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

create();
