import { _isValidArgument } from './utils'
import { _runWarn } from './_run'

const errorMsg = msg => `You should provide a string.\nReceived: ${JSON.stringify(msg)}`

const _post = actions => (msg = null) => {
  if (_isValidArgument(msg)('string')(errorMsg(msg))) {
    const jsonMsg = JSON.stringify(msg)
    let work = actions
      .filter(({ message }) => JSON.stringify(message) === jsonMsg)
      .map(action => action.func)
      .pop()

    let warn = null
    if (!work) {
      work = function () { return null }
      warn = `${jsonMsg} is not a registered action for this worker`
    }

    return _runWarn(work, warn)
  }

  return null
}

export { _post }
