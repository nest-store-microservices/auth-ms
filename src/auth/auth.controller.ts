import { Controller, Inject, Post } from '@nestjs/common';

import { NATS_CLIENT } from 'src/config';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_CLIENT) private readonly client:ClientProxy) {}


  @MessagePattern('auth.login')   
  login(@Payload() loginDto: LoginDto) {
    return {
      loginDto
    };
  }

  @MessagePattern('auth.register')  
  register(@Payload() registerDto: RegisterDto) {
    return {
      registerDto
    };
  }

  @MessagePattern('auth.verify')
  verify() {
    return 'verify';
  }

}
