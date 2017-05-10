import { _isArrayOfArrays, _isArrayOfObjects, _isArrayOfStrings } from './utils'

const __errorMsg = arr =>
  'You should provide an array of strings, an array of objects, an array of arrays or no arguments.' +
  `\nReceived: ${JSON.stringify(arr)}`

const __errorMsgWrongLenght = actualLength => expectedLength =>
  'You should provide the same number of [args] as the number of registered actions on the worker.' +
  `\nThis worker has ${expectedLength} actions registered.` +
  `\nNumber of [args] received: ${actualLength}`

function _postAll (arr = []) {
  if (!Array.isArray(arr)) {
    console.error(new TypeError(__errorMsg(arr)))
    return null
  }

  const __isArraysArray = _isArrayOfArrays(arr)
  const __isObjectsArray = _isArrayOfObjects(arr)
  const __isStringsArray = _isArrayOfStrings(arr)

  if (!(__isArraysArray || __isObjectsArray || __isStringsArray)) {
    console.error(new TypeError(__errorMsg(arr)))
    return null
  }

  if (arr.length === 0) return Promise.all(this.actions.map(({ message }) => this.postMessage(message)))

  if (__isStringsArray) return Promise.all(arr.map(msg => this.postMessage(msg)))

  if (__isObjectsArray) return Promise.all(arr.map(({ message, args }) => this.postMessage(message, args)))

  if (__isArraysArray) {
    if (arr.length !== this.actions.length) {
      console.error(new TypeError(__errorMsgWrongLenght(arr.length)(this.actions.length)))
      return null
    }
    return Promise.all(arr.map((args, index) => this.postMessage(this.actions[index].message, args)))
  }

  return null
}

export { _postAll }
