const { NODE_ENV, isTestMode, jsonReplacer, MONGODB_URI } = require('./utils')
const http = require('http')
const express = require('express')
const helmet = require('helmet')
const logger = require('./logs')
const { mongoose, schema } = require('./database')
const {
  httpRequestLoggingMiddleware: logMiddleware,
  graphqlExpressMiddleware,
  apiHomeMiddleware,
  httpErrorMiddleware,
  errorFourZeroFourMiddleware
} = require('./middlewares')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

/**
* Event listener for HTTP server "listening" event.
 *
 * @param {Object} server the http server instance
 *
 * @returns {null} server process is continous here, so no returns
 */
function onListening (server) {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`

  logger.info(`🚧  Pms Api is Listening on ${bind} - ${NODE_ENV}`)
}

/**
 * Event listener for HTTP server "error" event.
 * @param {Error} error an error message
 * @returns {null} error already logged exits process
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    return logger.error(error.message)
  }

  switch (error.code) {
    case 'EACCES':
      logger.error('port requires elevated privileges')
      return isTestMode || process.exit(1)
    case 'EADDRINUSE':
      logger.error('port is already in use')
      return isTestMode || process.exit(1)
    default:
      return logger.error(error.message)
  }
}
app.set('json spaces', 2)
app.set('json replacer', jsonReplacer)
app.use(express.urlencoded({ extended: false }), express.json())
app.use(helmet(), logMiddleware)
app.get('/', apiHomeMiddleware)
app.use('/graphql', graphqlExpressMiddleware({ schema }))
app.use(errorFourZeroFourMiddleware, httpErrorMiddleware)

server.on('listening', onListening.bind(null, server)).on('error', onError)

// Only run this section if file is loaded directly (eg `node app.js`)
// module loaded by something else eg. test or cyclic dependency
// Fixes error: "Trying to open unclosed connection."

/**
 * Start PMS
 */
async function startApp () {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  app.locals.database = mongoose.connection
  app.locals.database.on('error', logger.info.bind(null, 'connection error'))
  return server.listen(PORT)
}

/**
 * Stop App
 *
 * @returns
 */
async function stopApp () {
  await mongoose.disconnect()
  return server.close()
}

if (require.main === module) startApp()

module.exports = { app, startApp, stopApp, server, onError, onListening }
