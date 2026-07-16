import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'example-pass' })
  @IsString()
  @MaxLength(30)
  @MinLength(5)
  @Matches(/[0-9]/, { message: 'The password must contain a number.' })
  password: string;
}
