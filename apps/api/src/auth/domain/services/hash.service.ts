import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashService {
  abstract hash(password: string): Promise<string>;

  abstract compare(password: string, hashedPassword: string): Promise<boolean>;
}
