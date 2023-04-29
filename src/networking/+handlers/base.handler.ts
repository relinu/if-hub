import { Client } from "../+models/client";
import { Packet } from "../+models/packet";

export abstract class BaseHandler {

    public abstract check(client: Client, packet: Packet): boolean;
    public abstract handle(client: Client, packet: Packet): boolean;
    public abstract get type(): string;
}