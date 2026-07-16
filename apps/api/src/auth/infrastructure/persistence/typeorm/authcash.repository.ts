import { AuthCacheRepository } from '@auth/domain/repositories/authcash.repository';
import { CacheRepository } from '@auth/domain/repositories/cache.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisAuthCacheRepository extends AuthCacheRepository {
  constructor(private readonly cacheRepository: CacheRepository) {
    super();
  }

  async saveTempPassword(email: string, hashedPassword: string): Promise<void> {
    await this.cacheRepository.set(
      `temp_password:${email}`,
      hashedPassword,
      300,
    );
  }

  async getTempPassword(email: string): Promise<string | null> {
    return this.cacheRepository.get(`temp_password:${email}`);
  }

  async deleteTempPassword(email: string): Promise<void> {
    await this.cacheRepository.del(`temp_password:${email}`);
  }

  async getSendOtpAttempts(email: string): Promise<number> {
    return Number(
      (await this.cacheRepository.get(`otp_attempts:${email}`)) || 0,
    );
  }

  async incrementSendOtpAttempts(email: string): Promise<void> {
    const key = `otp_attempts:${email}`;

    const count = Number((await this.cacheRepository.get(key)) || 0);

    await this.cacheRepository.set(key, String(count + 1), 600);
  }

  async getVerifyOtpAttempts(email: string): Promise<number> {
    return Number(
      (await this.cacheRepository.get(`otp_verify_attempts:${email}`)) || 0,
    );
  }

  async incrementVerifyOtpAttempts(email: string): Promise<void> {
    const key = `otp_verify_attempts:${email}`;

    const count = Number((await this.cacheRepository.get(key)) || 0);

    await this.cacheRepository.set(key, String(count + 1), 300);
  }

  async clearVerifyOtpAttempts(email: string): Promise<void> {
    await this.cacheRepository.del(`otp_verify_attempts:${email}`);
  }
}
