import { _isValidArgument } from './utils'
import { _createReusableWorker } from './_createReusableWorker'

const errorMsg = actions => 'You should provide an array of objects ' +
'and every action should be an object containing two fields: `message` and `func`.' +
`\nReceived: ${JSON.stringify(actions)}`

const _create = (actions = []) => {
  if (_isValidArgument(actions)('objectsArray')(errorMsg(actions))) {
    return _createReusableWorker(actions)
  }
  return null
}

export { _create }
