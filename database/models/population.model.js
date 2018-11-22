const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const Schema = mongoose.Schema

/**
 * Total Population
 *
 * @returns {number} male plus female population
 */
function totalPopulation () {
  return `${this.male + this.female}`
}

const countType = {
  type: Number,
  validate: [{
    validator: value => value >= 0,
    message: 'please enter a positive count'
  }],
  default: 0,
  required: true
}

const genderCountSchema = new Schema({
  total: { ...countType, default: totalPopulation },
  male: countType,
  female: countType
}, { _id: false, autoIndex: false })

const locationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 50,
    required: [true, 'location name required']
  },
  population: { type: genderCountSchema }
})

locationSchema.add({ locations: { type: [locationSchema] } })

/**
 * Auto Calculate Population
 *
 * @param {Object} data location data
 *
 * @returns {Object} location data
 */
function calculatePopulation (data) {
  if (!data.population) data.population = { male: 0, female: 0, total: 0 }
  if (!data.locations || !data.locations.length) return data

  data.locations.forEach((location) => {
    const { male, female, total } = calculatePopulation(location).population
    data.population.total += total
    data.population.male += male
    data.population.female += female
  })

  return data
}

const LocationModel = mongoose.model('Location', locationSchema.clone())
const LocationTC = composeWithMongoose(LocationModel)
const schemaComposer = LocationTC.schemaComposer

const locationCreateUpdateResolvers = ['createOne', 'createMany']
  .map(name => LocationTC.getResolver(name))

/**
 * populationCreateResolvers
 *
 * @param {Array} param.resolvers array of resolvers
 *
 * @returns {Object} resolvers
 */
function populationCreateResolvers ({ resolvers }) {
  const name = word => `location${word[0].toUpperCase()}${word.substring(1)}`
  const mappedResolvers = {}
  resolvers.forEach(resolver => {
    mappedResolvers[name(resolver.name)] = resolver
      .wrapResolve(next => async resolverArgs => {
        resolverArgs.beforeRecordMutate = async (docs) => {
          const isMany = Array.isArray(docs)
          return isMany
            ? docs.map(doc => calculatePopulation(doc))
            : calculatePopulation(docs)
        }

        return next(resolverArgs)
      })
  })

  return mappedResolvers
}

schemaComposer.Query.addFields({
  locationById: LocationTC.getResolver('findById'),
  locationByIds: LocationTC.getResolver('findByIds'),
  locationOne: LocationTC.getResolver('findOne'),
  locationMany: LocationTC.getResolver('findMany'),
  locationCount: LocationTC.getResolver('count'),
  locationConnection: LocationTC.getResolver('connection'),
  locationPagination: LocationTC.getResolver('pagination')
})

schemaComposer.Mutation.addFields({
  ...populationCreateResolvers({ resolvers: locationCreateUpdateResolvers }),
  locationUpdateById: LocationTC.getResolver('updateById'),
  locationUpdateOne: LocationTC.getResolver('updateOne'),
  locationUpdateMany: LocationTC.getResolver('updateMany'),
  locationRemoveById: LocationTC.getResolver('removeById'),
  locationRemoveOne: LocationTC.getResolver('removeOne'),
  locationRemoveMany: LocationTC.getResolver('removeMany')
})

const graphqlSchema = schemaComposer.buildSchema()

module.exports = { graphqlSchema }
