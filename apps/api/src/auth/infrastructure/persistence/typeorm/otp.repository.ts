import { OtpRepository } from '@auth/domain/repositories/otp.repository';
import { Injectable } from '@nestjs/common';
import { CacheRepository } from 'src/auth/domain/repositories/cache.repository';
import { HashService } from 'src/auth/domain/services/hash.service';

@Injectable()
export class RedisOtpRepository extends OtpRepository {
  constructor(
    private readonly cacheRepository: CacheRepository,
    private readonly hashService: HashService,
  ) {
    super();
  }

  async save(email: string, otp: string): Promise<void> {
    const hash = await this.hashService.hash(otp);

    await this.cacheRepository.set(`otp:${email}`, hash, 120);
  }

  async find(email: string): Promise<string | null> {
    return this.cacheRepository.get(`otp:${email}`);
  }

  async delete(email: string): Promise<void> {
    await this.cacheRepository.del(`otp:${email}`);
  }
}
