import Redis from "ioredis";

export const redisPublisher = new Redis({
    host: 'redis-cache',
    port: 6379
})

export const redisSubscriber = new Redis({
    host: 'redis-cache',
    port: 6379
})