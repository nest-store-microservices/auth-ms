import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars {
    PORT: number;
    JWT_SECRET: string;

    NATS_SERVER: string[];
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    NATS_SERVER: joi.array().items(joi.string()).required(),
   
}).unknown(true);

const  { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVER: process.env.NATS_SERVER ? process.env.NATS_SERVER.split(',') : [],
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);

}

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT,
    JWT_SECRET: envVars.JWT_SECRET,
    natsServer: envVars.NATS_SERVER,
}