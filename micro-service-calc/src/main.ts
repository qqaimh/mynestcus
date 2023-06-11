import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RedisPubSubServer } from './cusrom-transporter/redis-pubsub.server';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new RedisPubSubServer(),
    },
  );
  app.listen();
}
bootstrap();
