
import * as winston from "winston";
import { format } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
	return `${info.timestamp} [${info.level}]: ${info.message}`;
});

const logger = winston.createLogger({
	level: "debug",
	format: combine(
		format.colorize(),
		timestamp({ format: "hh:mm:ss" }),
		myFormat
	),
	transports: [
		new winston.transports.Console(),
	],

});


export { logger };