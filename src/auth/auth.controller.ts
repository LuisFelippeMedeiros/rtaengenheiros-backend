import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { RouteVersion } from 'src/statics/route.version';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

@Controller({
  path: RouteVersion.route + 'auth',
  version: RouteVersion.version,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Get('token')
  token() {
    return this.authService.verifyToken();
  }
}
