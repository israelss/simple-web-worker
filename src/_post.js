import { _isValidArgument } from './utils'
import { _run } from './_run'

const __errorMsg = msg => `You should provide a string.\nReceived: ${JSON.stringify(msg)}`

const _post = actions => (msg = null, args) => {
  if (_isValidArgument(msg)('string')(__errorMsg(msg))) {
    let work = actions
      .filter(({ message }) => JSON.stringify(message) === JSON.stringify(msg))
      .map(action => action.func)
      .pop()

    if (!work) {
      work = function (msg) {
        console.warn(`WARN! ${msg} is not a registered action for this worker`)
        return `${msg} is not a registered action for this worker`
      }
      args = JSON.stringify(msg)
      return _run(work, [args])
    }

    if (args) return _run(work, args.filter(arg => !!arg))
    return _run(work)
  }

  return null
}

export { _post }
