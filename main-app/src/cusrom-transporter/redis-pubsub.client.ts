import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { error } from 'console';
import Redis from 'ioredis';

export class RedisPubSubClient extends ClientProxy {
  sub = new Redis();
  psub = new Redis();
  pub = new Redis();
  callBacks = {};

  constructor() {
    super();

    this.sub.subscribe('ALL', (err, count) => {
      if (err) return;
      this.pub.publish('ALL', JSON.stringify({ type: 'PONG' }));
    });

    this.sub.on('message', ( channel, message) => {
      console.log(`Received ${message} from ${channel}`);
      console.log(222, message);
      const messageJson = JSON.parse(message);
      if (channel === 'ALL' && messageJson.type === 'PONG') {
       // store instance id
      } else if (messageJson.type === 'JOB_RESPONSE') {
        // this.handleResponse(messageJson);
      }
    });

    this.psub.psubscribe('yuqing-.+', (err, count) => {
      if (err) return;
      this.pub.publish('ALL', JSON.stringify({ type: 'PONG' }));
    });

    this.psub.on('pmessage', (pattern, channel, message) => {
      console.log(`Received ${message} from ${channel}---${pattern}`);
      console.log(222, message);
      const messageJson = JSON.parse(message);
      if (channel === 'ALL' && messageJson.type === 'PONG') {
       // store instance id
      } else if (messageJson.type === 'JOB_RESPONSE') {
        this.handleResponse(messageJson);
      }
    });

    // this.sub.on('message', async (channel, message) => {
    //   console.log(`Received ${message} from ${channel}`);
    //   console.log(222, message);
    //   const messageJson = JSON.parse(message);
    //   if (channel === 'ALL' && messageJson.type === 'PONG') {
    //     await this.sub.subscribe(messageJson.uuid);
    //   } else if (messageJson.type === 'JOB_RESPONSE') {
    //     await this.handleResponse(messageJson);
    //   }
    // });
  }

  async connect(): Promise<any> {
    console.log('connect');
  }

  async close() {
    console.log('close');
  }

  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    return console.log('event to dispatch: ', packet);
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ) {
    console.log(1111, packet);
    try {
      this.pub.publish(
        'yuqing-123aaa',
        JSON.stringify({ type: 'JOB', ...packet }),
        (err, result) => {
          if (err) callback({ err });
          this.callBacks[packet.data.id] = callback;
        },
      );

      return () => delete this.callBacks[packet.data.id];
    } catch (err) {
      callback({ err });
    }
  }

  handleResponse(message) {
    const { err, response, isDisposed } = message.data;

    const id = response.id;

    const callback = this.callBacks[id];
    console.log(333, callback, response);
    if (!callback) {
      return false;
    }

    if (err || isDisposed) {
      callback({
        err,
        response,
        isDisposed,
      });
    } else {
      callback({
        err,
        response,
      });
    }
  }
}
