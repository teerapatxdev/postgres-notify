import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import helmet from 'helmet';

import { AppModule } from './app.module';

function extractConstraints(errors: ValidationError[]): string[] {
  let constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      constraints = constraints.concat(Object.values(error.constraints));
    }
    if (error.children && error.children.length) {
      constraints = constraints.concat(extractConstraints(error.children));
    }
  }

  return constraints;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ['*'],
        },
      },
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errorMessages = extractConstraints(validationErrors);
        return new BadRequestException({
          statusCode: 400,
          message: 'Bad Request',
          errors: errorMessages,
        });
      },
    }),
  );

  const swaggerOption = new DocumentBuilder()
    .setTitle('NestJS Tutorial')
    .setDescription('API developed throughout the API with NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOption);
  if (process.env.API_ENV_MODE === 'development') {
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.API_PORT);
}
bootstrap();
