const { expect, app, logger } = require('../helpers')

describe('App', () => {
  describe('- Server', () => {
    it('should be started', () => app.get('/')
      .then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Pms Api Up.')
        expect(logger.info.called).to.equal(true)
      }))
  })

  describe('- 404', () => {
    it('should return a 404 not found message', () => app.get('/hello')
      .then((response) => {
        expect(response.status).to.equal(404)
        expect(response.body.error).to
          .equal('Route Does Not Exist On The Pms Api')
      }))
  })
})
