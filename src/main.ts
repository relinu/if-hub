import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(parseInt(process.env.PORT) || 8300);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
