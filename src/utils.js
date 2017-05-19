// Argument validation
const isValidObjectsArray = arr => (fields = []) =>
  arr.every(obj => {
    return typeof obj === 'object' &&
      !Array.isArray(obj) &&
        fields.every(field => obj.hasOwnProperty(field))
  })

const testArray = {
  'actionsArray': arr => isValidObjectsArray(arr)(['message', 'func']),
  'arraysArray': arr => arr.every(item => Array.isArray(item)),
  'objectsArray': arr => isValidObjectsArray(arr)(),
  'postParamsArray': arr => isValidObjectsArray(arr)(['message', 'args']),
  'stringsArray': arr => arr.every(item => typeof item === 'string')
}

const isValidArg = arg => type => {
  if (type === 'null') return arg === null
  if (type === 'undefined') return arg === undefined
  if (Array.isArray(arg)) {
    if (type !== 'array' && !testArray[type]) return false
    if (type === 'array') return true
    return testArray[type](arg)
  }
  if (arg) return typeof arg === type.toString() // eslint-disable-line
  return false
}

const isValid = argument => (types = null) => {
  if (Array.isArray(types)) return types.some(type => isValidArg(argument)(type))
  if (isValidArg(argument)(types)) return true
  return false
}

// Argument error builder
const argumentError = ({ expected = '', received, extraInfo = '' }) => {
  try {
    return new TypeError(`${'You should provide ' + expected}${'\n' + extraInfo}${'\nReceived: ' + JSON.stringify(received)}`)
  } catch (err) {
    if (err.message === 'Converting circular structure to JSON') {
      return new TypeError(`${'You should provide ' + expected}${'\n' + extraInfo}${'\nReceived a circular structure: ' + received}`)
    }
    console.error(err)
    return new TypeError('You should provide something else...')
  }
}

// Response builder
const makeResponse = work => `
  self.onmessage = event => {
    const args = event.data.message.args
    if (args) {
      self.postMessage((${work}).apply(null, args))
      return close()
    }
    self.postMessage((${work})())
    return close()
  }
`

export {
  makeResponse,
  argumentError,
  isValid
}
