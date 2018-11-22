const morgan = require('morgan')
const logger = require('../logs')
const { logServiceError } = require('./../utils')
const graphqlHTTP = require('express-graphql')

/**
 * Pmss Http Request Logging Middlware
 *
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
function httpRequestLoggingMiddleware (req, res, next) {
  return morgan('combined', {
    immediate: true, stream: { write: msg => logger.info(msg.trim()) }
  })(req, res, next)
}

/**
 * 404 Error Middlware
 *
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
function errorFourZeroFourMiddleware (req, res, next) {
  const error = new Error('Route Does Not Exist On The Pms Api')
  error.status = 404

  return next(error)
}

/**
 * Express Error Middleware
 *
 * @param {Object} error the error object
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the error in json
 */
function httpErrorMiddleware (error, req, res, next) {
  const { status = 500, message } = error
  error.response = {
    status,
    request: {
      ...req,
      path: req.path,
      agent: { protocol: req.protocol },
      res: {
        httpVersion: req.httpVersion,
        headers: { date: req._startTime },
        client: { servername: req.hostname }
      }
    }
  }

  logServiceError(error)

  return res.status(error.status).json({ status, error: message })
}

/**
 * Pms Home Middleware
 *
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the http json response
 */
function apiHomeMiddleware (req, res) {
  return res.status(200).json({ status: 200, message: 'Pms Api Up.' })
}

/**
 * GraphQl Middleware
 *
 * @param {Object} param.schema graphql schema
 *
 * @returns {Function} graphql express middleware
 */
function graphqlExpressMiddleware ({ schema }) {
  return (req, res) => graphqlHTTP({
    schema,
    graphiql: true,
    context: { database: req.app.locals.database },
    formatError: err => ({ message: err.message, status: err.status })
  })(req, res)
}

/**
 * CheckQuerySizeMiddleware Middlware
 *
 * @export
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
function checkQuerySizeMiddleware (req, res, next) {
  const query = req.query.query || req.body.query
  const message = 'query size exceeded'
  if (query && query.length > 2000) {
    return res.status(500).json({ status: 'error', message })
  }
  next()
}

module.exports = {
  apiHomeMiddleware,
  graphqlExpressMiddleware,
  checkQuerySizeMiddleware,
  errorFourZeroFourMiddleware,
  httpErrorMiddleware,
  httpRequestLoggingMiddleware
}
