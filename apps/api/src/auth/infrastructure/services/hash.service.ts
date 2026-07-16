import { HashService } from '@auth/domain/services/hash.service';
import { Compare, Hash } from '@common/utils/hash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashInputService extends HashService {
  async hash(password: string): Promise<string> {
    return await Hash(password);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await Compare(password, hashedPassword);
  }
}
