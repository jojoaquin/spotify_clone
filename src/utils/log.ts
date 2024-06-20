import { createLogger, format, transports } from "winston";

const { combine, printf, timestamp, splat } = format;

const now = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;

const myFormat = printf(({ level, message }) => {
  return `${level}: ${message} - [ ${now} ]`;
});

export const log = createLogger({
  level: "info",
  format: combine(format.colorize(), splat(), timestamp(), myFormat),
  transports: [new transports.Console()],
});
