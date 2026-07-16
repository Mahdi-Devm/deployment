import { AuthCacheRepository } from '@auth/domain/repositories/authcash.repository';
import { OtpRepository } from '@auth/domain/repositories/otp.repository';
import { UserRepository } from '@auth/domain/repositories/user.repository';
import { HashService } from '@auth/domain/services/hash.service';
import { OtpGeneratorService } from '@auth/domain/services/otp-generator.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { SendOtpDto } from '../dto/send-otp.dto';

@Injectable()
export class SendOtpUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly otpRepository: OtpRepository,
    private readonly otpGenerator: OtpGeneratorService,
    private readonly authCacheRepository: AuthCacheRepository,
  ) {}
  async execute(dto: SendOtpDto) {
    const { email, password } = dto;

    const existUser = await this.userRepository.findByEmail(email);

    if (existUser) {
      if (!existUser.password) {
        throw new BadRequestException(
          'Account is corrupted. Please contact support.',
        );
      }
      const isPasswordValid = await this.hashService.compare(
        password,
        existUser.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
    } else {
      const hashedPassword = await this.hashService.hash(password);
      await this.authCacheRepository.saveTempPassword(email, hashedPassword);
    }

    const attempts = await this.authCacheRepository.getSendOtpAttempts(email);

    if (attempts >= 5) {
      throw new HttpException(
        'Too many OTP requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = this.otpGenerator.generate();

    await this.otpRepository.save(email, otp);
    await this.authCacheRepository.incrementSendOtpAttempts(email);

    return {
      success: true,
      message: 'OTP sent to your email',
    };
  }
}
