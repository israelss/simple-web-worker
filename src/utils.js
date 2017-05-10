const __invalidActions = (actions = null) => (types = null) => {
  if (Array.isArray(actions)) {
    if (types === 'objectsArray') return actions.some(action => typeof action !== 'object' || Array.isArray(action) || action === null)
    if (types === 'stringsArray') return actions.some(action => typeof action !== 'string')
  }
  return false
}

const __isArrayOf = type => arr => {
  let testItems = null
  if (type === 'arrays') testItems = item => Array.isArray(item)
  if (type === 'objects') testItems = item => typeof item === 'object' && !Array.isArray(item)
  if (type === 'strings') testItems = item => typeof item === 'string'

  if (testItems) return arr.every(testItems)
  return false
}

const __isValidArgument = arg => (types = null) => {
  if (types === 'null') return arg === null

  if (types === 'undefined') return arg === undefined

  if (Array.isArray(types)) return types.some(type => __isValidArgument(arg)(type))

  if (!arg || __wrongType(arg, types) || __invalidActions(arg)(types)) return false
  return true
}

const __wrongType = (obj = null, type = '') => {
  if (Array.isArray(type)) return type.every(type => __wrongType(obj, type))

  if (Array.isArray(obj)) {
    if (type === 'objectsArray' || type === 'stringsArray' || type === 'array') return false
    return true
  }

  return typeof obj !== type.toString() // eslint-disable-line
}

const _isArrayOfArrays = arr => __isArrayOf('arrays')(arr)
const _isArrayOfObjects = arr => __isArrayOf('objects')(arr)
const _isArrayOfStrings = arr => __isArrayOf('strings')(arr)

const _isValidArgument = arg => (types = null) => (errorMsg = '') => {
  if (Array.isArray(types)) {
    const valid = types.some(type => __isValidArgument(arg)(type))
    if (!valid) console.error(new TypeError(errorMsg))
    return valid
  }

  if (!arg || __wrongType(arg, types) || __invalidActions(arg)(types)) {
    console.error(new TypeError(errorMsg))
    return false
  }
  return true
}

export { _isArrayOfArrays, _isArrayOfObjects, _isArrayOfStrings, _isValidArgument }
