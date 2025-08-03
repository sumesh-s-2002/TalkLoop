import winston, { format } from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { v4 as uuidv4 } from "uuid";
import rotateFile from "winston-daily-rotate-file";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
config();

const LOG_FILENAME = "talkloop";
const ENV = process.env;
console.log(ENV);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIRNAME = __dirname;

const levels = {
  error: 0,
  warn: 1,
  http: 2,
  info: 3,
  debug: 4,
};

const { combine, timestamp, errors, json } = format;

const elasticTransport = (spanTracerId, indexPrefix) => {
  const esTransportOpts = {
    level: "debug",
    indexPrefix,
    indexSuffixPattern: "YYYY-MM-DD",
    transformer: (logData) => {
      const spanId = spanTracerId;
      return {
        "@timestamp": new Date(),
        severity: logData.level,
        stack: logData.stack ?? null,
        service_name: logData.meta?.name,
        service_version: logData.meta?.version,
        message: `${logData.message}`,
        data: JSON.stringify(logData.meta?.data ?? {}),
        span_id: spanId,
        utcTimestamp: logData.timestamp,
      };
    },
    clientOpts: {
      node: "http://elasticsearch:9200",
      maxRetries: 5,
      requestTimeout: 10000,
      sniffOnStart: false,
    },
  };
  return esTransportOpts;
};

export function getLogger(indexPrefix = "talkloop") {
  const spanTracerId = uuidv4();

  const transport = new rotateFile({
    filename: path.join(DIRNAME, "../../logs", `${LOG_FILENAME}-%DATE%.log`),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxFiles: "7d",
    maxSize: "20m",
    frequency: "3h",
  });

  const logger = winston.createLogger({
    level: "debug",
    levels,
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: "logger-service" },
    transports: [
      transport,
      new ElasticsearchTransport({
        ...elasticTransport(spanTracerId, indexPrefix),
      }),
    ],
    handleExceptions: true,
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: combine(winston.format.colorize(), winston.format.simple()),
      })
    );
  }

  return logger;
}
