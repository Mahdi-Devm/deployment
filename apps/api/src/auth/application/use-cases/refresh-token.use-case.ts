import { UserRepository } from '@auth/domain/repositories/user.repository';
import { HashService } from '@auth/domain/services/hash.service';
import { JwtAllService } from '@auth/domain/services/jwt.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtservice: JwtAllService,

    private readonly hashServiec: HashService,
  ) {}
  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      const payload = await this.jwtservice.verifyRefreshToken(refreshToken);

      const user = await this.userRepository.findById(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await this.hashServiec.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtservice.generateAccessToken({
        sub: user.id,
        role: user.role,
      });

      return newAccessToken;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
