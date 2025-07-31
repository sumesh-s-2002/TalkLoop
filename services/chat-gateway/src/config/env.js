import { config } from "dotenv";
import process from "node:process"
config();

function requireEnv(name){
    const val = process.env[name];
    if(!val) throw new Error(`Missing required env var : ${name}`);
    return val;
}


export const env = {
    port : parseInt(process.env.PORT, 10) || 5000,
    jwt_secret : requireEnv("JWT_SECRET"),
    socket_url : requireEnv("SOCKET_URL"),
    rabbitmq_url : requireEnv("RABBITMQ_URL")
};