const { graphql } = require('graphql')
const { schema, expect, queriesStub, mutationStub } = require('../helpers')
const { addMockFunctionsToSchema } = require('graphql-tools')

const gqlCalls = { Queries: queriesStub, Mutations: mutationStub }

describe('Location Schema', () => {
  addMockFunctionsToSchema({
    schema,
    mocks: {
      Int: () => 100,
      Float: () => 12.34,
      String: () => 'Location'
    },
    preserveResolvers: true
  })

  Object.keys(gqlCalls).forEach(type => describe(`${type} -`, () => {
    gqlCalls[type].forEach((item) => {
      const { id, query, variables, context: ctx, expected } = item

      it(`${id}`, async () => {
        const gql = await graphql(schema, query, null, { ctx }, variables)
        expect(gql).deep.equals(expected)
      })
    })
  }))
})
