import dotenv from "dotenv";
import path from "path";
import process from "node:process";
dotenv.config({ path: path.resolve("./shared/.env") });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} is required but not defined.`
    );
  }
  return value;
}

export const env = {
  rabbitmq_url: requireEnv("RABBITMQ_URL"),
};
