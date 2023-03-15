import { Controller, Post, Body } from '@nestjs/common';
import { verify } from 'argon2';

import { AuthService } from '../services/auth.service';
import { SessionModel } from '../models/session.model';
import { UserModel } from '../models/user.model';

@Controller('auth')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userModel: UserModel,
    private readonly sessionModel: SessionModel,
  ) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    const { name, email, password } = body;
    const user = await this.authService.createUser(name, email, password);
    const session = await this.authService.createSession(user.insertId);
    return { session };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.userModel.getUserByEmail(email);
    const valid = await verify(password, user.password);
    if (!valid) throw new Error('Invalid password');
    const session = await this.authService.createSession(user.id);
    return { session };
  }

  @Post('logout')
  async logout(@Body() body: { session: string }) {
    await this.sessionModel.deleteSession(body.session);
  }

  @Post('check')
  async checkSession(@Body() body: { session: string; role: string[] }) {
    const { session, role } = body;
    const user = await this.userModel.getUserBySession(session);
    const roles = await this.userModel.getUserRoles(user.id);
    if (!user) throw new Error('Invalid session');
    if (!roles.some((r) => role.includes(r.name)))
      throw new Error('Invalid role');
    return { user };
  }
}
