import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BaseHandler } from './+handlers/base.handler';
import { Client } from './+utils/client';

@Injectable()
export class HandlerRegistry {
  constructor(private moduleRef: ModuleRef) {}

  public addHandler<T extends BaseHandler>(client: Client, type: Type<T> | string): T {
    const handler = this.moduleRef.get(type, { strict: false });
    client.addHandler(handler);
    return handler;
  }

  public removeHandler<T extends BaseHandler>(client: Client, type: Type<T> | string) {
    const handler = this.moduleRef.get(type, { strict: false });
    client.removeHandler(handler);
  }
}
