import { argumentError } from './helpers/builders'
import { isValid } from './helpers/validators'

const isActionOf = actions => newAction =>
  actions.some(action => action.message === newAction.message)

const pushInto = actions => action => {
  if (isActionOf(actions)(action)) {
    console.warn(`WARN! An action with message "${action.message}" is already registered for this worker`)
    return actions.length
  }
  return actions.push(action)
}

export const register = actions => (action = null) => {
  if (isValid(action)(['action', 'actionsArray'])) {
    if (Array.isArray(action)) {
      return action.reduce((actions, action) => {
        pushInto(actions)(action)
        return actions
      }, actions).length
    }

    return pushInto(actions)(action)
  }
  console.error(argumentError({
    expected: 'an array of actions or an action',
    received: action,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  }))
  return null
}
