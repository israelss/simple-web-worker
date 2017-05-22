import { argumentError, isValid } from './utils'

const isActionOf = actions => newAction =>
  actions.some(action => action.message === newAction.message)

const warnMsg = action =>
  `WARN! An action with message "${action.message}" is already registered for this worker`

const pushInto = actions => action => {
  if (isActionOf(actions)(action)) {
    console.warn(warnMsg(action))
    return actions.length
  }
  return actions.push(action)
}

const makeOptionsFor = action => {
  return {
    expected: 'an array of actions or an action',
    received: action,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  }
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
  console.error((argumentError(makeOptionsFor(action))))
  return null
}
