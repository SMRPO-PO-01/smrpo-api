import { Body, Controller, Post } from '@nestjs/common';

import { DUser } from '../user.dto';
import { VLogin } from '../user.validation';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: VLogin) {
    const { user, token } = await this.authService.login(data);
    return new DUser(user, token);
  }
}
