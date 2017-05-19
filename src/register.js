import { argumentError, isValid } from './utils'

const JSONreplacer = (key, value) => {
  if (value instanceof Function) return value.toString()
  return value
}

const isActionOf = actions => newAction =>
  actions.some(action => JSON.stringify(action, JSONreplacer) === JSON.stringify(newAction, JSONreplacer))

const warnMsg = action =>
  `WARN! The action ${JSON.stringify(action, JSONreplacer)} is already registered for this worker`

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
