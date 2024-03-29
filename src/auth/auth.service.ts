import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { GroupService } from 'src/group/group.service';
import { GroupExclude } from 'src/group/entities/group.entity';
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
    private readonly groupService: GroupService,
  ) {}

  async login(user: User) {
    const payload: UserPayload = {
      sub: user.id,
      group: user.group_id,
    };

    const group = await this.groupService.findById(user.group_id);
    const jwtToken = this.jwtService.sign(payload);

    return {
      user_id: user.id,
      company_id: user.company_id,
      access_token: jwtToken,
      group: new GroupExclude(group),
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
        if (!user.active) {
          throw new UnauthorizedError('Usuário está inativo no sistema');
        }
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
