import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UnauthorizedError } from './errors/unauthorized.error';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload: UserPayload = {
      sub: user.id,
    };

    const jwtToken = await this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }

  async verifyToken() {
    return;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedError(
      'Usuário e/ou senha não correspondem ao cadastrado em nossa base de dados.',
    );
  }
}
