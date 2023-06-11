import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { pid, ppid } from 'node:process';
import { delay, of } from 'rxjs';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('sum')
  sum(data) {
    console.log(1111, pid, ppid, data);
    return of(data).pipe(delay(3000));
  }
}
