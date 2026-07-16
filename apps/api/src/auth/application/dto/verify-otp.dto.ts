import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '00000' })
  @Length(5, 5)
  code: string;
}
