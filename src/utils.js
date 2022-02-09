const CLOSE_WORKER = '__CLOSE_WORKER__';
// Argument validation
const isValidObjectWith = fields => obj =>
  !!obj && !Array.isArray(obj) && fields.every(field => Object.getOwnPropertyNames(obj).includes(field))

const isValidAction = obj => {
  return isValidObjectWith(['message', 'func'])(obj) &&
    typeof obj.func === 'function' && typeof obj.message === 'string'
}

const isValidActionsArray = arr => arr.every(isValidAction)

const isValidPostParams = obj => {
  return isValidObjectWith(['message', 'args'])(obj) &&
    Array.isArray(obj.args) && typeof obj.message === 'string'
}

const isValidPostParamsArray = arr => arr.every(isValidPostParams)

const isValidObjectsArray = arr => (fields = []) =>
  arr.every(isValidObjectWith(fields))

const testArray = {
  actionsArray: arr => isValidActionsArray(arr),
  arraysArray: arr => arr.every(item => Array.isArray(item)),
  objectsArray: arr => isValidObjectsArray(arr)(),
  postParamsArray: arr => isValidPostParamsArray(arr),
  stringsArray: arr => arr.every(item => typeof item === 'string')
}

const isValidArg = arg => type => {
  if (type === 'null') return arg === null
  if (type === 'undefined') return arg === undefined
  if (type === 'action') return isValidAction(arg)
  if (Array.isArray(arg)) {
    if (type !== 'array' && !testArray[type]) return false
    if (type === 'array') return true
    return testArray[type](arg)
  }
  if (arg) return typeof arg === type.toString(); // eslint-disable-line
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
    if (err.message.includes('Converting circular structure to JSON')) {
      return new TypeError(`${'You should provide ' + expected}${'\n' + extraInfo}${'\nReceived a circular structure: ' + received}`)
    }
    throw err
  }
}

// Response builder
const makeResponse = work => `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      self.postMessage((${work}).apply(null, args))
      return close()
    }
    self.postMessage((${work})())
    return close()
  }
`

const makeManualCloseResponse = work => `
self.onmessage = async function(event) {
  if(event.data.message === '${CLOSE_WORKER}'){
    return close()
  }

  const args = event.data.message.args
  
  if (args) {
    const msg = await (${work}).apply(null, args)
    self.postMessage(msg)
  }
  const msg = await (${work})()
  self.postMessage(msg)
}
`

const isAsyncFunc = (func) => Object.prototype.toString.call(func) === "[object AsyncFunction]"

export {
  makeResponse,
  isAsyncFunc,
  makeManualCloseResponse,
  argumentError,
  isValid,
  CLOSE_WORKER
}
