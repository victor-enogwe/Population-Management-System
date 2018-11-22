const errorStub = require('./error.stub')
const queriesStub = require('./queries.stub')
const mutationStub = require('./mutations.stub')

module.exports = { ...errorStub, queriesStub, mutationStub }
