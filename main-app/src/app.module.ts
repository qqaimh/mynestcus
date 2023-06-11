import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisPubSubClient } from './cusrom-transporter/redis-pubsub.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CALC_SERVICE',
        customClass: RedisPubSubClient,
      },
      {
        name: 'LOG_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
