const { expect, should } = require('chai')
const supertest = require('supertest')
const sandbox = require('sinon').createSandbox()
const { schema } = require('../../database')
const { server, onError, startApp, stopApp, app } = require('../../app')
const logger = require('../../logs')
const utils = require('../../utils')
const stubs = require('../stubs')

module.exports = {
  sandbox,
  expect,
  should: should(),
  server,
  app: supertest(app),
  startApp,
  stopApp,
  onError,
  logger,
  ...utils,
  ...stubs,
  schema
}
