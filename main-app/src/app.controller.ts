import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import Redis from 'ioredis';

@Controller()
export class AppController {
  redis = new Redis();

  constructor(
    @Inject('CALC_SERVICE') private calcClient: ClientProxy,
    @Inject('LOG_SERVICE') private logClient: ClientProxy,
  ) {}

  ccc() {
    this.redis.psubscribe('pat?ern', (err, count) => {});

    // Event names are "pmessage"/"pmessageBuffer" instead of "message/messageBuffer".
    this.redis.on('pmessage', (pattern, channel, message) => {});
    this.redis.on('pmessageBuffer', (pattern, channel, message) => {});
  }

  @Get()
  calc(@Query('num') str): Observable<number> {
    const numArr = str.split(',').map((item) => parseInt(item));

    this.logClient.emit('log', 'calc:' + numArr);
    return of(77888);
    // return this.calcClient.send('sum', numArr);
  }
}
