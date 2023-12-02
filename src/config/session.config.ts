import session from "express-session";
import 'dotenv/config';
import { ConfigService } from "@nestjs/config";
import connectRedis from 'connect-redis';
import { Redis } from "ioredis";

const config : ConfigService = new ConfigService();

const clientOptions = new Redis({
    host : config.get<string>('REDIS_HOST'),
    port : config.get<number>('REDIS_PORT')
});

const RedisStore = new connectRedis({
    client : clientOptions,
    ttl : 60
});;

export const sessionOption : session.SessionOptions = {
    secret : config.get<string>('SESSION_SECRET'),
    resave : false,
    saveUninitialized : false,
    cookie : {
        httpOnly: true,
        maxAge : 60000 /// 단위는 ms
    },
    store : RedisStore
}