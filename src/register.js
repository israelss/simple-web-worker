import { argumentError, isValid } from './utils'

const pushInto = actions => action => actions.push(action)

export const register = actions => (action = null) => {
  const options = {
    expected: 'an array of actions or an action',
    received: action,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  }
  if (isValid(action)(['object', 'objectsArray'])(argumentError(options))) {
    if (Array.isArray(action)) {
      action.forEach(pushInto(actions))
      return actions.length
    }
    return pushInto(actions)(action)
  }
  return null
}
