const winston = require('winston')
const path = require('path')

const options = {
  file: {
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: process.env === 'development' ? 'debug' : 'info',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    silent: process.env.NODE_ENV === 'test',
    colorize: true,
    prettyPrint: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }
}

winston.addColors({})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      ...options.file,
      filename: path.join(__dirname, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      ...options.file,
      filename: path.join(__dirname, 'combined.log')
    }),
    new winston.transports.Console(options.console)
  ],
  exceptionHandlers: [
    new winston.transports.File({
      ...options.file,
      filename: path.join(__dirname, 'exceptions.log')
    })
  ],
  exitOnError: false
})

module.exports = logger
