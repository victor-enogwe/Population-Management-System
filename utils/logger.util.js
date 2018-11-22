const logger = require('../logs')

/**
 * Http Error
 * @typedef {Object} HttpError
 * @property {string} code - The error message
 * @property {string} message - The error code
 * @property {string} response - Http response
 */

/**
 * Service Error Handler
 *
 * @param {HttpError} error the error object
 *
 * @returns {Object} winston log info
 */
function logServiceError (error) {
  const { message, code } = error
  let logMsg = ''
  if (error.response) {
    const { status, request, request: { res } } = error.response
    const { method, path, agent: { protocol }, headers } = request
    const { httpVersion, headers: { date }, client: { servername } } = res
    const ua = headers ? headers['user-agent'] : 'Pms 1.0'
    logMsg = `::1 - - [${date}] "${method} ${path} HTTP/${httpVersion}" `
    logMsg += `${status} - "${message || ''} ${code || ''}" ${ua}"`
    logMsg += ` - "Pms (+${protocol}//${servername})`
  } else {
    const stack = process.env.NODE_ENV === 'development' ? error.stack : ''
    logMsg = `${error.message} ${error.code || stack}`
  }

  return logger.error(logMsg)
}

module.exports = { logServiceError }
