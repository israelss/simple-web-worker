import { _isValidArgument } from './utils'
import { _createDisposableWorker } from './_createDisposableWorker'

const __createSinglePromise = ({response, args}) => _createDisposableWorker(response).post({ args })

const __makeResponse = work => `
  self.onmessage = event => {
    const args = event.data.message.args
    if (args) {
      self.postMessage(${work}.apply(null, args))
      return close()
    }
    self.postMessage(${work}())
    return close()
  }
`

const __run = ({ work, args }) => {
  const response = __makeResponse(work)
  return __createSinglePromise({ response, args })
}

const __errorMsg = type => arg => {
  try {
    return `You should provide ${type}.\nReceived: ${JSON.stringify(arg)}`
  } catch (err) {
    if (err.message === 'Converting circular structure to JSON') {
      return `You should provide ${type}.\nReceived a circular structure: ${arg}`
    }
    console.error(err)
    return `You should provide something else...`
  }
}

const _run = (work = null, args) => {
  const errors = []
  const __errorMsgWork = __errorMsg('a function')(work)
  const __errorMsgArgs = __errorMsg('an array')(args)

  if (!_isValidArgument(work)('function')(__errorMsgWork)) {
    errors.push(__errorMsgWork)
  }
  if (!_isValidArgument(args)(['array', 'undefined'])(__errorMsgArgs)) {
    errors.push(__errorMsgArgs)
  }

  if (errors.length === 0) {
    return __run({ work, args })
  }
  return null
}

export { _run }
