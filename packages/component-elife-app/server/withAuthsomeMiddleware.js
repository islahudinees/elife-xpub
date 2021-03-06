const Authsome = require('authsome')
const { authsomeMode } = require('./authsomeMode')
const { AuthorizationError } = require('@pubsweet/errors')

const systemModels = require('@pubsweet/models')

const AUTHORIZATION_ERROR_MESSAGE = 'Operation not permitted :('

const can = async (userId, verb, entity, models) => {
  const authsome = new Authsome({ mode: authsomeMode }, { models })

  const permission = await authsome.can(userId, verb, entity)

  if (!permission) {
    throw new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE)
  }

  return permission.filter || (id => id)
}

const STANDARD_TYPES = ['Query', 'Mutation', 'Subscription']
const withAuthsomeMiddleware = (
  resolvers = {},
  useCases = {},
  { _can, _models } = { _can: can, _models: systemModels },
) =>
  Object.entries(resolvers).reduce(
    (acc, [gqlType, gqlResolvers]) => ({
      ...acc,
      [gqlType]: STANDARD_TYPES.includes(gqlType)
        ? injectMiddleware(gqlResolvers, useCases, _can, _models)
        : gqlResolvers,
    }),
    {},
  )

const injectMiddleware = (
  gqlResolvers,
  useCases,
  _can = can,
  _models = systemModels,
) =>
  Object.entries(gqlResolvers).reduce(
    (acc, [name, originalResolver]) => ({
      ...acc,
      [name]: async (parentQuery, params, ctx) => {
        await _can(
          ctx.user,
          {
            name,
            policies: useCases[`${name}UseCase`].authsomePolicies,
          },
          params,
          _models,
        )

        // NOTE: This will throw if the conditions don't pass so no need
        // to actually use the output of `can`

        return originalResolver(parentQuery, params, ctx)
      },
    }),
    {},
  )

module.exports = { withAuthsomeMiddleware, AUTHORIZATION_ERROR_MESSAGE }
