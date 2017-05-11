import { _isValidArgument } from './utils'

const __errorMsg = action =>
  'You should provide an array of actions or an action. ' +
  'Every action should be an object containing two fields: `message` and `func`.' +
  `\nReceived: ${JSON.stringify(action)}`

const __pushInto = actions => action => actions.push(action)

const _register = actions => (obj = null) => {
  if (_isValidArgument(obj)(['object', 'objectsArray'])(__errorMsg(obj))) {
    if (Array.isArray(obj)) {
      obj.forEach(__pushInto(actions))
      return actions.length
    }
    return __pushInto(actions)(obj)
  }
  return null
}

export { _register }
