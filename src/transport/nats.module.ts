import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_CLIENT } from 'src/config';


@Module({
   imports:[
       ClientsModule.register([
         { 
           name: NATS_CLIENT, 
           transport: Transport.NATS,
           options:{
                servers: envs.natsServer,   
           } 
         },
       ]),
     ],
     exports:[
        ClientsModule.register([
            { 
              name: NATS_CLIENT, 
              transport: Transport.NATS,
              options:{
                   servers: envs.natsServer,   
              } 
            },
          ]),
     ],
    
    providers: [],
})
export class NatsModule {}
