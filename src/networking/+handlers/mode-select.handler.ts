import { Injectable, Logger } from "@nestjs/common";
import { Client } from "../+models/client";
import { Packet, ParamTypes } from "../+models/packet";
import { BaseHandler } from "./base.handler";

export const MODE_DATA_KEY = "mode_key";

@Injectable()
export class ModeSelectHandler extends BaseHandler {
    private readonly logger = new Logger(ModeSelectHandler.name);
    public get type(): string { return "MODE" }

    constructor() {
        super();
    }

    public check(client: Client, packet: Packet): boolean {
        return !client.getData<number>(MODE_DATA_KEY) && packet.length > 0;
    }

    public handle(client: Client, packet: Packet): boolean {
        const mode: number = packet.getParameter(0, ParamTypes.number);
        switch (mode) {
            case 0:
                this.logger.debug(`Client(${client.id}) switched mode to: directtrade`);
                break;
            case 1:
                this.logger.debug(`Client(${client.id}) switched mode to: battle`);
                break;
            default:
                return false;
        }

        client.setData(MODE_DATA_KEY, mode);
        return true;
    }
}