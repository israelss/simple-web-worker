import { _isValidArgument } from './utils'

const errorMsg = arr => `You should provide an array of strings or no arguments.\nReceived: ${JSON.stringify(arr)}`
function _postAll (arr = [], log = false) {
  if (_isValidArgument(arr)('stringsArray')(errorMsg(arr))) {
    return arr.length === 0
      ? Promise.all(this.actions.map(({ message }) => this.postMessage(message)))
      : Promise.all(arr.map(msg => this.postMessage(msg)))
  }

  return null
}

export { _postAll }
