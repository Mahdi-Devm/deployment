import { UserRepository } from '@auth/domain/repositories/user.repository';
import {
  accessTokenName,
  refreshTokenName,
} from '@common/constants/jwt.constants';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.clearRefreshToken();

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Logged out successfully',
      cookiesToClear: [accessTokenName, refreshTokenName],
    };
  }
}
