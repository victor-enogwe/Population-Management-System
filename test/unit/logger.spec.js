const { logger, logServiceError, errorStub, expect } = require('../helpers')

describe('Logger:', () => {
  describe('- logServiceError:', () => {
    // @TODO test should be refactored to use callee return values
    it('should call the winston error logger function', () => {
      const error = { ...new Error('message'), ...errorStub }
      logServiceError(error)
      expect(logger.error.called).to.equal(true)
      delete error.response
      logServiceError(error)
      expect(logger.error.called).to.equal(true)
      process.env.NODE_ENV = 'development'
      logServiceError(error)
      expect(logger.error.called).to.equal(true)
      process.env.NODE_ENV = 'test'
    })
  })
})
