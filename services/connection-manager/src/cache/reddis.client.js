import { createClient } from "redis"
import env from "../config/env.js"

const redisClient = createClient({
    url : `${env.redis_base}:${env.redis_port}`
})

redisClient.on('error', (err)=>{
    console.error("Redis client error", err)
})

await redisClient.connect();
export default redisClient;
