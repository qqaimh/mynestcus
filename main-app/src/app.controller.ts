import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import { RedisPubSubClient } from './cusrom-transporter/redis-pubsub.client';

@Controller()
export class AppController {
  constructor(
    @Inject('CALC_SERVICE') private calcClient: RedisPubSubClient,
    @Inject('LOG_SERVICE') private logClient: ClientProxy,
  ) {}

  @Get()
  calc(@Query('num') str) {
    this.calcClient.send('sum', { id: '11111' }).subscribe({
      next: (res) => {
        console.log(4444, res);
      },
      error: (error) => {
        console.log(5555, error);
      },
    });
  }
}
