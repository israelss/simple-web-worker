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

export {
  isValid
}
