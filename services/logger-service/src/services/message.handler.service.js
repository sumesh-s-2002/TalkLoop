import { getLogger } from "./log.service.js";
const logger = getLogger();

export function messageHandler(msg) {
  const { level, message, meta = {} } = msg;
  try {
    console.log(msg);
    if (!["info", "warn", "error", "http", "debug"].includes(level)) {
      throw new Error("provide a valid level");
    }
    logger[level](message, meta);
  } catch (err) {
    throw err;
  }
}
