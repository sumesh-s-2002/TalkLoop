import { config } from  "dotenv"
import process from "node:process"
config();

function requireEnv(name){
    const val = process.env[name];
    if(!val) throw Error(`value not found for the variable ${name}`);
    return val;
}

export const env = {
    port : requireEnv("PORT") || 8000
}

