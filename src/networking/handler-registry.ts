import { Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { BaseHandler } from "./+handlers/base.handler";
import { Client } from "./+models/client";

@Injectable()
export class HandlerRegistry {

    constructor(private moduleRef: ModuleRef) { }

    public addHandler<T extends BaseHandler>(client: Client, type: Type<T>): T {
        const handler = this.moduleRef.get(type);
        client.addHandler(handler);
        return handler;
    }
}