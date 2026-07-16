import { CacheRepository } from '@auth/domain/repositories/cache.repository';
import { CacheService } from '@common/services/cache.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisCacheRepository extends CacheRepository {
  constructor(private readonly cacheService: CacheService) {
    super();
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.cacheService.set(key, value, ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.cacheService.get(key);
  }

  async del(key: string): Promise<void> {
    await this.cacheService.del(key);
  }
}
