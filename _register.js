import { _isValidArgument } from './utils'

const errorMsg = action => 'You should provide an array of actions or an action. ' +
'Every action should be an object containing two fields: `message` and `func`.' +
`\nReceived: ${JSON.stringify(action)}`

const _pushInto = actions => action => actions.push(action)

const _register = actions => (obj = null) => {
  if (_isValidArgument(obj)(['object', 'objectsArray'])(errorMsg(obj))) {
    if (Array.isArray(obj)) {
      obj.forEach(_pushInto(actions))
      return actions.length
    }
    return _pushInto(actions)(obj)
  }
  return null
}

export { _register }
