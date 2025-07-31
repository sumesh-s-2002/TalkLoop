import dotenv from "dotenv"
dotenv.config()

function requireEnv(name){
    const env = process.env[name];
    if(!env) throw Error(`cannot find the env named ${name}`);
    return env;   
}

export default {
    redis_base : requireEnv("REDIS_BASE"),
    redis_port : requireEnv("REDIS_PORT"),
    port : requireEnv("PORT"),
    rabbitmq_url : requireEnv("RABBITMQ_URL")
}
