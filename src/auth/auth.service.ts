
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from 'generated/prisma';
import { LoginDto, RegisterDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';


@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit{
    private readonly logger = new Logger(AuthService.name);

    constructor( private readonly jwtService: JwtService ){
        super();
    }


    onModuleInit() {
        this.$connect();
        this.logger.log('Prisma Client connected to the database');
    }



    async register(registerDto: RegisterDto) {
        const { name, email, password } = registerDto;
        try {
    
          const user = await this.user.findUnique({
            where: { email },
          })

          if (user){
            throw new RpcException({
              statusCode: 400,
              message: 'User already exists',

          })
        }

        const newUser = await this.user.create({
            data: {
                name,
                email,
                password: bcrypt.hashSync(password, 10), // Hash the password before saving it
                },
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        return {
            user: newUser,
            token: this.jwtService.sign({ id: newUser.id }), // Generate a JWT token for the user
        }
    
          
        } catch (error) {
          throw new RpcException({
            statusCode: 500,           
            error: error.message,
          })
        }
    }


    async login(loginDto: LoginDto){
        const { email, password } = loginDto;
        try {
            const user = await this.user.findUnique({
                where: { email },
            })

            if (!user) {
                throw new RpcException({
                    statusCode: 401,
                    message: 'Invalid credentials',
                })
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password!)

            if (!isPasswordValid) {
                throw new RpcException({
                    statusCode: 401,
                    message: 'Invalid credentials',
                })
            }

            const { password: _, ...rest } = user // Exclude password from the response

            return {
                user: rest,
                token: this.jwtService.sign({ id: user.id }), // Generate a JWT token for the user
            }
        } catch (error) {
            throw new RpcException({
                statusCode: 500,
                error: error.message,
            })
        }
    }


    async verifyToken(token: string) {
        try {
            const { sub, iat, exp, ...user } = this.jwtService.verify(token, { secret: envs.JWT_SECRET });
            
            return {
                user,
                token: this.jwtService.sign({ id: sub }), // Generate a new JWT token for the user
            }

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid token',
            })
        }
    }

}