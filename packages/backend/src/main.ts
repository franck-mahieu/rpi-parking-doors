import { NestFactory } from '@nestjs/core';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';

const config = new ConfigService();
const PORT = config.get('PORT') ? config.get('PORT') : 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  if ((process.env.NODE_ENV = 'development')) {
    const config = new DocumentBuilder()
      .setTitle('rpi-parking-doors API')
      .setDescription('API of rpi-parking-doors webapp project')
      .setVersion('1.0')
      .addBasicAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    app.enableCors({
      origin: 'http://localhost:8889',
      credentials: true,
    });
  } else {
    app.enableCors();
  }

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
    }),
  );

  app.enableShutdownHooks();
  await app.listen(PORT);

  console.log(`main.ts - rpi-door is listening on port ${PORT}`);

  process.on('unhandledRejection', error => {
    console.error(`main.ts - unhandledRejection: ${error}`);
    app.close();
  });

  process.on('uncaughtException', error => {
    console.error(`main.ts - uncaughtException: ${error}`);
    app.close();
  });

  process.on('SIGHUP', error => {
    console.error(`main.ts - SIGHUP: ${error}`);
    app.close();
  });
}

bootstrap();
