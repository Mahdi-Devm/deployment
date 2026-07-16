import { LoginResponse } from '@auth/application/types/login-response.type';
import { JwtPayload } from '@common/@types/jwt-payload.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class JwtAllService {
  abstract generateAccessToken(payload: JwtPayload): Promise<string>;
  abstract generateRefreshToken(payload: JwtPayload): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<JwtPayload>;
  abstract verifyRefreshToken(token: string): Promise<JwtPayload>;
  abstract generateToken(payload: JwtPayload): Promise<LoginResponse>;
}
