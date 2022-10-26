import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //Swagger
  const configu = new DocumentBuilder()
    .setTitle('RTA Engenheiros API')
    .setDescription(
      'RTA Engenheiros, é uma API do sistema de gerenciamento empresarial',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configu);
  SwaggerModule.setup('api', app, document);

  //Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  // app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
