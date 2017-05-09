import { _isValidArgument } from './utils'
import { _createDisposableWorker } from './_createDisposableWorker'

const _createSinglePromise = (response, warn) => _createDisposableWorker(response).post({ warn: warn })

const _makeResponse = work => `
  self.onmessage = event => {
    const { warn } = event.data.message
    if (warn) {
      console.warn('WARN! ' + warn)
      self.postMessage(warn)
      return close()
    }
    self.postMessage(${work}())
    close()
  }
`

const __run = (work = null, warn = null) => {
  if (_isValidArgument(work)('function')(`You should provide a function.\nReceived: ${JSON.stringify(work)}`)) {
    return _createSinglePromise(_makeResponse(work), warn)
  }
  return null
}

const _run = (work = null) => __run(work)

const _runWarn = (work = null, warn = null) => __run(work, warn)

export { _run, _runWarn }
