import {
  CustomTransportStrategy,
  IncomingRequest,
  OutgoingResponse,
  Server,
  Transport,
} from '@nestjs/microservices';
import Redis from 'ioredis';
import { Observable, isObservable } from 'rxjs';

export class RedisPubSubServer
  extends Server
  implements CustomTransportStrategy
{
  sub = new Redis();
  pub = new Redis();
  uuid = 'yuqing-123aaa';

  constructor() {
    super();

    this.sub.subscribe('ALL', this.uuid, (err, count) => {
      if (err) return;
      console.log(444, this.uuid);
      const res = { type: 'PONG', uuid: this.uuid };
      this.pub.publish('ALL', JSON.stringify(res));
    });
    this.sub.on('message', async (channel, message) => {
      console.log(`Received ${message} from ${channel}`);
      const messageJson = JSON.parse(message);
      if (channel === 'ALL' && messageJson.type === 'PING') {
        const res = { type: 'PONG', uuid: this.uuid };
        this.pub.publish('ALL', JSON.stringify(res));
      } else if (channel === this.uuid && messageJson.type === 'JOB') {
        await this.handleMessage(messageJson);
      }
    });
  }
  transportId?: symbol | Transport;
  listen(callback: (...optionalParams: unknown[]) => any) {
    console.log(this.messageHandlers);
    callback();
  }

  close() {}

  async handleMessage(message: any) {
    const { data, pattern } = message;

    const handler = this.getHandlerByPattern(pattern);

    if (!handler) {
      return;
    }

    let response$ = await handler(data);

    if (!isObservable(response$)) {
      response$ = this.transformToObservable(response$) as Observable<any>;
    }

    const publish = async (data) => {
      const res = { type: 'JOB_RESPONSE', data };
      await this.pub.publish(this.uuid, JSON.stringify(res));
    };

    response$ && this.send(response$, publish);
  }
}
