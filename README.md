# Population-Management-System

[![Build Status](https://travis-ci.com/victor-enogwe/Population-Management-System.svg?branch=master)](https://travis-ci.com/victor-enogwe/Population-Management-System)
[![Coverage Status](https://coveralls.io/repos/github/victor-enogwe/Population-Management-System/badge.svg?branch=master)](https://coveralls.io/github/victor-enogwe/Population-Management-System?branch=master)

Population Management System that contains a list of locations and the total number of residents in each location broken down by gender

## Technologies

NodeJS, GraphQL, ExpressJS, MongoDb, GraphQL-Compose GraphQL-Compose-Mongoose

## Requirements

The following software are required to run this app:

- NodeJS
- Node Package Manager (npm)
- MongoDb - Database

## Local Development

Start local development using the following steps:

- Clone the repository locally
- setup a local `mongodb` database
- clone the `env.sample` file and rename it to `.env`
- replace default `.env` variables with yours if neccessary
- run `npm install` to install node packages
- Run `npm run start:dev` to start up the application
- access the application via http at [localhost:3000](localhost:3000)

## Testing

This application can be tested locally by running `npm test`

### GraphQL

All documentations can be obtained on the  graphql api itself

local development docs [localhost:3000](here)

- **Queries**
  - **Find All Locations**
    - query
      ``` GQL
      query {
        locationMany {
          name
          population {
            male,
            female
            total
          }
          locations {
            name
            population {
              male
              female
              total
            }
          }
        }
      }
      ```

- **Mutations**

  - **Create Location**

    - mutation
      ``` GQL
      mutation($location: CreateOneLocationInput!) {
        locationCreateOne(record: $location) {
          record {
            _id
            name
            population {
              total,
              male,
              female,
            }
            locations {
              _id,
              name,
              population {
                total,
                male,
                female
              },
              locations {
                _id,
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
      ```

    - sample argument variables
      ``` JSON
      {
        "location": {
          "name": "enmnmnmm",
          "locations": [
            {
              "name": "aaa",
              "locations": [
                {
                  "name": "bbbbb",
                  "population": {
                    "male": 10,
                    "female": 150
                  }
                },
                {
                  "name": "cccc",
                  "population": {
                    "male": 10,
                    "female": 180
                  }
                }
              ]
            },
            {
              "name": "dddd",
              "population": {
                "male": 10,
                "female": 190
              }
            }
          ]
        }
      }
      ```

  - **Create Locations**

    - mutation
      ``` GQL
      mutation($locations: [CreateManyLocationInput!]!) {
        locationCreateMany (records: $locations) {
          records {
            name,
            population {
              male,
              female,
              total
            },
            locations {
              name
              population {
                male
                female,
                total
              }
            }
          }
        }
      }
      ```

    - sample argument variables
      ``` JSON
      {
        "locations": [
          {
            "name": "aaaaa",
            "locations": [
              {
                "name": "bbbbb",
                "population": {
                  "male": 10,
                  "female": 150
                }
              },
              {
                "name": "cccc",
                "population": {
                  "male": 10,
                  "female": 180
                }
              }
            ]
          },
          {
            "name": "aaaaa",
            "locations": [
              {
                "name": "bbbbb",
                "population": {
                  "male": 10,
                  "female": 150
                }
              },
              {
                "name": "cccc",
                "population": {
                  "male": 10,
                  "female": 180
                }
              }
            ]
          }
        ]
      }
      ```

  - **Delete One Location**

    - mutation
      ``` GQL
      mutation ($filter: FilterRemoveOneLocationInput) {
        locationRemoveOne(filter: $filter) {
          recordId
          record {
            name
          }
        }
      }
      ```

    - sample argument variables
      ``` JSON
      {
        "filter": {
          "name": "enmnmnmm"
        }
      }
      ```

  - **Update A Location**

    - muation
      ``` GQL
      mutation($updateOne: UpdateOneLocationInput!, $filter: FilterUpdateOneLocationInput) {
        locationUpdateOne(record: $updateOne, filter: $filter) {
          record {
            name,
            population {
              total
              male
              female
            }
          }
        }
      }
      ```

    - sample argument variables
      ``` JSON
      {
        "filter": {
          "name": "enmnmnmm"
        },
        "updateOne": {
          "name": "aaabbb",
          "population": {
            "male": 100,
            "female": 100
          }
        }
      }
      ```

## How To Contribute

To contribute, fork this repository, make required changes and open a pull request.
