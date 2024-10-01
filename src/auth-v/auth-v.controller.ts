import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthDto } from 'src/auth/dto';
import { Response } from 'express';

@Controller('auth')
export class AuthVController {
  constructor(private authService: AuthService) {}

  @Get('sign-up')
  async signUp() {}

  @Get('sign-in')
  @Render('auth/sign-in')
  async getSignIn() {
    return { message: 'Hello world!' };
  }

  @Post('sign-in')
  // @Render('user/me')
  async signIn(@Res() res: Response, @Body() dto: AuthDto) {
    console.log(dto);
    // return { email: body.email, password: body.password };
    try {
      const token = await this.authService.signIn(dto);
      return res.render('user/me', {
        token: token.access_token,
      });
    } catch (error) {
      return res.render('auth/sign-in', {});
    }
  }
}
