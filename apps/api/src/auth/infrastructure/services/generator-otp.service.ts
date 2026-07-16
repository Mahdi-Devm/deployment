import { generateOtp } from '@common/utils/code-generator.util';
import { Injectable } from '@nestjs/common';
import { OtpGeneratorService } from 'src/auth/domain/services/otp-generator.service';

@Injectable()
export class RandomOtpGeneratorService extends OtpGeneratorService {
  generate(): string {
    return generateOtp();
  }
}
