import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transport/nats.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    NatsModule,
    JwtModule.register({
      global: true,
      secret:envs.JWT_SECRET, // Secret key for signing the JWT
      signOptions: { expiresIn: '1h' }, // Token expiration time

    })
  ]
})
export class AuthModule {}
