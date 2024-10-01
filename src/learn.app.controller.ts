import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './learn.app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // @Get()
  // @Render('index')
  // root() {
  //   return { message: 'Hello world!' };
  // }

  @Get('/test')
  getHello(@Req() req: Request, @Res() res: Response) {
    const ssrEnabled = req.query.ssr;
    console.log('ssrEnabled', ssrEnabled);
    if (ssrEnabled && ssrEnabled == 'true') {
      return res.render(this.appService.getViewName(), {
        message: 'Hello world!',
      });
    } else {
      return res.json({
        message: 'Hello world!',
      });
    }
  }
}
