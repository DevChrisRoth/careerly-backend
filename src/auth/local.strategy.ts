import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable({})
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    }); //config
  }

  async validate(
    _email: string,
    _password: string,
  ): Promise<{
    userid: any;
  }> {
    const user = await this.authService.validateUser(_email, _password);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Benutzername oder Passwort falsch',
      });
    }
    return user;
  }
}
