import { Module } from '@nestjs/common';
import { HealthController } from 'src/controllers/health.controller';
import { UserModule } from './auth.module';

@Module({
  imports: [UserModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
