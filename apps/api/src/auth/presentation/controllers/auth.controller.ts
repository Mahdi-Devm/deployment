import { SendOtpDto } from '@auth/application/dto/send-otp.dto';
import { VerifyOtpDto } from '@auth/application/dto/verify-otp.dto';
import { LogoutUseCase } from '@auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '@auth/application/use-cases/refresh-token.use-case';
import { SendOtpUseCase } from '@auth/application/use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from '@auth/application/use-cases/verify-otp.use-case';
import type { JwtPayload } from '@common/@types/jwt-payload.type';
import {
  accessTokenExpireTimeByMilliSecond,
  accessTokenName,
  cookieOptions,
  refreshTokenExpireTimeByMilliSecond,
  refreshTokenName,
} from '@common/constants/jwt.constants';
import { Public } from '@common/decorators/public.decorator';
import { UserInfo } from '@common/decorators/user.decorator';
import { setCookies } from '@common/utils/set-cookie';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}
  @Get('profile')
  getProfile(@Req() request: Request) {
    const user = request.user;
    return {
      id: user?.sub,
      role: user?.role,
      message: 'This is protected data!',
    };
  }
  @Post('sendOtp')
  @Public()
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.sendOtpUseCase.execute(dto);
  }

  @Post('verifyOtp')
  @Public()
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.verifyOtpUseCase.execute(dto);

    setCookies(response, [
      {
        name: accessTokenName,
        value: tokens.accessToken,
        options: {
          ...cookieOptions,
          maxAge: accessTokenExpireTimeByMilliSecond,
        },
      },
      {
        name: refreshTokenName,
        value: tokens.refreshToken,
        options: {
          ...cookieOptions,
          maxAge: refreshTokenExpireTimeByMilliSecond,
        },
      },
    ]);

    return {
      success: true,
    };
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.[refreshTokenName];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      const accessToken = await this.refreshTokenUseCase.execute(refreshToken);

      setCookies(response, [
        {
          name: accessTokenName,
          value: accessToken,
          options: {
            ...cookieOptions,
            maxAge: accessTokenExpireTimeByMilliSecond,
          },
        },
      ]);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Refresh token failed',
      };
    }
  }

  @Post('logout')
  async logout(
    @UserInfo() user: JwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const logout = await this.logoutUseCase.execute(user.sub);
    response.clearCookie(accessTokenName, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });

    response.clearCookie(refreshTokenName, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });
    return {
      success: logout.success,
    };
  }
}
