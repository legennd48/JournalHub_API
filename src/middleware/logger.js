import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.join(__dirname, '../../logs');

const logStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

export const requestLogger = morgan('combined', { stream: logStream });

/**
 * Creates a logger using Winston.
 *
 * @typedef {Object} winstonLogger
 * @property {string} level - The log level.
 * @property {Object} format - The log format.
 * @property {Array} transports - The log transports.
 * @property {Object} transports[0] - The error log transport.
 * @property {string} transports[0].filename - The filename of the error log.
 * @property {string} transports[0].level - The log level for the error log.
 * @property {Object} transports[1] - The combined log transport.
 * @property {string} transports[1].filename - The filename of the combined log.
 */
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});


export const logger = winstonLogger;