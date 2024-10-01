import { Module } from '@nestjs/common';
import { AuthVController } from './auth-v.controller';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthVController],
  providers: [AuthService, JwtStrategy],
})
export class AuthVModule {
  constructor() {}
}
