import { Injectable } from '@nestjs/common';
import { Client } from 'src/networking/+models/client';
import { HandlerRegistry } from 'src/networking/handler-registry';

@Injectable()
export class DirectTradeService {
  constructor(private handlerRegistry: HandlerRegistry) {}

  public initialize(_client: Client) {
    //TODO: Add handlers; send room packet ?
  }
}
