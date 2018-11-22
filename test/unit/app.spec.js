const { expect, serverError, logger, onError } = require('../helpers')

describe('App', () => {
  describe('- onError', () => {
    it('should log an error', () => {
      onError(serverError('listen', 'EACCES'))
      expect(logger.error.calledWith('port requires elevated privileges'))
        .to.equal(true)
      onError(serverError('listen', 'EADDRINUSE'))
      expect(logger.error.calledWith('port is already in use'))
        .to.equal(true)
      onError(serverError('listen'))
      expect(logger.error.called).to.equal(true)
      onError(serverError('some-error-type'))
      expect(logger.error.called).to.equal(true)
    })
  })
})
