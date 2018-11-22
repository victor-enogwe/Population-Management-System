const { schemaResponseStub } = require('./schema.stub')
module.exports = [
  {
    id: 'Has Valid Type Schema',
    query: `query { __schema { types { name } } }`,
    variables: { },
    context: { },
    expected: schemaResponseStub
  }
]
