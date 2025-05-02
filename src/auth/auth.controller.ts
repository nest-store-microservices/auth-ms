import { Controller, Inject, Post } from '@nestjs/common';

import { NATS_CLIENT } from 'src/config';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from './dtos';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_CLIENT) private readonly client:ClientProxy, private readonly auntService:AuthService) {}


  @MessagePattern('auth.login')   
  login(@Payload() loginDto: LoginDto) {
    return this.auntService.login(loginDto);
  }

  @MessagePattern('auth.register')  
   register(@Payload() registerDto: RegisterDto) {
    return this.auntService.register(registerDto);
  }

  @MessagePattern('auth.verify')
  verify() {
    return 'verify';
  }

}
