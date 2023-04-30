import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AuthService {
  private tokens: Set<string>;

  constructor() {
    this.tokens = new Set<string>();
  }

  public createToken() {
    const token = uuidV4();
    this.tokens.add(token);
    return token;
  }

  public redeemToken(token: string): boolean {
    return this.tokens.delete(token);
  }
}
