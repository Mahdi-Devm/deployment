import { AuthCacheRepository } from '@auth/domain/repositories/authcash.repository';
import { OtpRepository } from '@auth/domain/repositories/otp.repository';
import { UserRepository } from '@auth/domain/repositories/user.repository';
import { HashService } from '@auth/domain/services/hash.service';
import { JwtAllService } from '@auth/domain/services/jwt.service';
import { Roles } from '@common/enums/role-app.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly otpRepository: OtpRepository,
    private readonly authCacheRepository: AuthCacheRepository,
    private readonly jwtservice: JwtAllService,
  ) {}
  async execute(dto: VerifyOtpDto) {
    const { email, code } = dto;

    const attempts = await this.authCacheRepository.getVerifyOtpAttempts(email);

    if (attempts >= 3) {
      await this.otpRepository.delete(email);
      throw new BadRequestException(
        'Too many failed attempts. Request a new OTP.',
      );
    }

    const storedOtp = await this.otpRepository.find(email);
    if (!storedOtp) {
      throw new BadRequestException(
        'OTP expired or not found. Please request a new OTP.',
      );
    }

    const isOtpValid = await this.hashService.compare(String(code), storedOtp);
    if (!isOtpValid) {
      await this.authCacheRepository.incrementVerifyOtpAttempts(email);
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpRepository.delete(email);
    await this.authCacheRepository.clearVerifyOtpAttempts(email);

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      const hashedPassword =
        await this.authCacheRepository.getTempPassword(email);
      if (!hashedPassword) {
        throw new BadRequestException('Password not found. Please try again.');
      }
      user = await this.userRepository.create({
        email,
        password: hashedPassword,
        role: Roles.USER,
      });

      await this.userRepository.save(user);
      await this.authCacheRepository.deleteTempPassword(email);
    }

    const tokens = await this.jwtservice.generateToken({
      role: user.role,
      sub: user.id,
    });

    const hashedRefreshToken = await this.hashService.hash(tokens.refreshToken);
    console.log(hashedRefreshToken, '1');
    user.refreshToken = hashedRefreshToken;
    await this.userRepository.save(user);

    return tokens;
  }
}
