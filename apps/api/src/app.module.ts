import { AuthModule } from '@auth/presentation/module/auth.module';
import { TypeOrmConfig } from '@common/config/typeorm.config';
import { AuthorizationModule } from '@common/modules/authorization.module';
import { AppCacheModule } from '@common/modules/cache.module';
import { RedisModule } from '@common/modules/redis.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    RedisModule.forRootAsync(),
    AuthModule,
    AppCacheModule,
    AuthorizationModule,
  ],
})
export class AppModule {}
