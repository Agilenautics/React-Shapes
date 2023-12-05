import { createLogger, format, transports } from "winston";
const developmentLogger = () => {
  const { combine, colorize, timestamp, printf } = format;
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]:${message}`;
  });
  return createLogger({
    level: "debug",
    // format: winston.format.json(),
    format: combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
      myFormat
    ),
    // defaultMeta: { service: "user-service" },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new transports.Console(),
      //   new winston.transports.File({ filename: "error.log", level: "error" }),
      //   new winston.transports.File({ filename: "combined.log" }),
    ],
  });
};

export default developmentLogger;
