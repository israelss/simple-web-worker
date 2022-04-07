import { argumentError } from './helpers/builders'
import { isValid } from './helpers/validators'

export function postAll (arr = []) {
  if (isValid(arr)(['arraysArray', 'postParamsArray', 'stringsArray'])) {
    if (arr.length === 0) return Promise.all(this.actions.map(({ message }) => this.postMessage(message)))

    if (arr.every(item => typeof item === 'string')) {
      return Promise.all(arr.map(msg => this.postMessage(msg)))
    }

    if (arr.every(item => typeof item === 'object' && !Array.isArray(item))) {
      return Promise.all(arr.map(({ message, args }) => this.postMessage(message, args)))
    }

    if (arr.every(item => Array.isArray(item)) && arr.length === this.actions.length) {
      return Promise.all(arr.map((args, index) => this.postMessage(this.actions[index].message, args)))
    }
  }

  console.error(argumentError({
    expected: 'an array of arrays, an array of objects, or an array of strings',
    received: arr,
    extraInfo: 'If an array of arrays, ' +
      'it must have the same length as the actions registered for this worker.\n' +
      'If an array of objects, every object must containing two fields:\n* message\n* args'
  }))
  return null
}
