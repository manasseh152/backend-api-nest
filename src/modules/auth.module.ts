import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/auth.controller';
import { Database } from 'src/providers/database';
import { AuthService } from 'src/services/auth.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [Database, AuthService],
})
export class UserModule {}
