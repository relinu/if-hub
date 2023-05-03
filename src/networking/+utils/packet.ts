export enum ParamTypes {
  object = 'object',
  boolean = 'boolean',
  number = 'number',
  string = 'string',
}

type ParamReturn<T extends ParamTypes> = T extends ParamTypes.object
  ? object
  : T extends ParamTypes.boolean
  ? boolean
  : T extends ParamTypes.number
  ? number
  : T extends ParamTypes.string
  ? string
  : never;

export class Packet {
  readonly type: string;
  private parameters: string[];

  constructor(type: string, parameters?: string[]) {
    this.type = type;
    this.parameters = parameters ? parameters : [];
  }

  public getParameter<T extends ParamTypes>(
    index: number,
    val: T,
  ): ParamReturn<T> {
    const param = this.parameters[index];
    switch (val) {
      case ParamTypes.object:
        return JSON.parse(param) as any;
      case ParamTypes.boolean:
        return Boolean(param) as any;
      case ParamTypes.number:
        return Number(param) as any;
      default:
      case ParamTypes.string:
        return param as any;
    }
  }

  public toString() {
    let msg = this.type;
    if (this.parameters.length > 0) {
      msg += ';' + this.parameters.join(';');
    }

    return msg + '\n';
  }

  get length(): number {
    return this.parameters?.length;
  }

  public static toPacket(data: string): Packet {
    const parameters = data.split(';');
    const type = parameters.shift();
    return new Packet(type, parameters);
  }
}
