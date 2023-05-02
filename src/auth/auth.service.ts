import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AuthService {
  private tokens: Map<string, string>;

  constructor() {
    this.tokens = new Map<string, string>();
  }

  public createToken(name: string) {
    const token = uuidV4();
    this.tokens.set(token, name);
    return token;
  }

  public redeemToken(token: string): string {
    const name = this.tokens.get(token);
    if (name) {
      this.tokens.delete(token);
      return name;
    }

    return undefined;
  }
}
