const { createOneResponseStub } = require('./schema.stub')

module.exports = [
  {
    id: 'Create Location',
    query: `
      mutation($location: CreateOneLocationInput!) {
        locationCreateOne(record: $location) {
          record {
            name
            population {
              total,
              male,
              female,
            }
            locations {
              name,
              population {
                total,
                male,
                female
              },
              locations {
                name,
                population {
                  total
                  male
                  female
                }
              }
            }
          }
        }
      }
      `,
    variables: {
      'location': {
        'name': 'abule enmnmnmm',
        'locations': [
          {
            'name': 'aaa',
            'locations': [
              {
                'name': 'bbbbb',
                'population': {
                  'male': 10,
                  'female': 150
                }
              },
              {
                'name': 'cccc',
                'population': {
                  'male': 10,
                  'female': 180
                }
              }
            ]
          },
          {
            'name': 'dddd',
            'population': {
              'male': 10,
              'female': 190
            }
          }
        ]
      }
    },
    context: { },
    expected: createOneResponseStub
  }
]
