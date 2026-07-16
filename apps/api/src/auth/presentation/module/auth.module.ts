import { User } from '@auth/domain/entities/user.entity';
import { CacheRepository } from '@auth/domain/repositories/cache.repository';
import { OtpRepository } from '@auth/domain/repositories/otp.repository';
import { UserRepository } from '@auth/domain/repositories/user.repository';
import { HashService } from '@auth/domain/services/hash.service';
import { JwtAllService } from '@auth/domain/services/jwt.service';
import { OtpGeneratorService } from '@auth/domain/services/otp-generator.service';
import { RedisCacheRepository } from '@auth/infrastructure/persistence/redis/cache.repository';
import { RedisOtpRepository } from '@auth/infrastructure/persistence/typeorm/otp.repository';
import { TypeOrmUserRepository } from '@auth/infrastructure/persistence/typeorm/user.repository';
import { RandomOtpGeneratorService } from '@auth/infrastructure/services/generator-otp.service';
import { HashInputService } from '@auth/infrastructure/services/hash.service';
import { JwtAuthService } from '@auth/infrastructure/services/jwt.service';
import { CacheService } from '@common/services/cache.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    CacheService,
    JwtService,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: OtpRepository,
      useClass: RedisOtpRepository,
    },
    {
      provide: OtpGeneratorService,
      useClass: RandomOtpGeneratorService,
    },
    {
      provide: JwtAllService,
      useClass: JwtAuthService,
    },
    {
      provide: HashService,
      useClass: HashInputService,
    },
  ],
  exports: [JwtAllService],
})
export class AuthModule {}
