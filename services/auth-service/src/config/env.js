import { config } from "dotenv";
import process from "node:process"

config();

function requireEnv(name){
    const val = process.env[name];
    if(!val) throw new Error(`Missing required env var : ${name}`);
    return val;
}


export const env = {
    port : parseInt(process.env.PORT, 10) || 4000,

    dbUrl : requireEnv("DATABASE_URL"),
    smptp_host : requireEnv("SMTP_HOST") || smtp.gmail.com,
    smtp_port : requireEnv("SMTP_PORT") || 587,
    smptp_user : requireEnv("SMTP_USER"),
    smtp_pass : requireEnv("SMTP_PASS"),
    mail_from : requireEnv("MAIL_FROM"),
    base_url : requireEnv("APP_BASE_URL"),
    jwt_secret : requireEnv("JWT_SECRET")
};