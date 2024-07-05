import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthDto } from './dto';
import { hash, verify } from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface jwtToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    const passwordHash = await hash(dto.password); // Generate password hash

    try {
      const user = await this.database.user.create({
        data: {
          email: dto.email,
          hash: passwordHash,
        },
        // select: { email: true, createdAt: true, },
      }); // Save user in DB
      return this.signToken(user.id, user.email); // Return new user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use.');
        }
      }
    }
  }

  async signIn(dto: AuthDto) {
    // Find user by email
    const user = await this.database.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // If user does not exist throw exception
    if (!user) throw new ForbiddenException('Incorrect credentials');
    // Compare passwords
    const pwMatches = await verify(user.hash, dto.password);
    // If password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Incorrect credentials');
    // Send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<jwtToken> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
