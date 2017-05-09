const _wrongType = (obj = null, type = '') => {
  if (Array.isArray(type)) return type.every(type => _wrongType(obj, type))

  if (Array.isArray(obj)) {
    if (type === 'objectsArray' || type === 'stringsArray' || type === 'array') return false
    return true
  }

  return typeof obj !== type.toString() // eslint-disable-line
}

const _invalidActions = (actions = null) => (types = null) => {
  if (Array.isArray(actions)) {
    if (types === 'objectsArray') return actions.some(action => typeof action !== 'object' || Array.isArray(action) || action === null)
    if (types === 'stringsArray') return actions.some(action => typeof action !== 'string')
  }
  return false
}

const __isValidArgument = (actions = null) => (types = null) => {
  if (Array.isArray(types)) return types.some(type => __isValidArgument(actions)(type))

  if (!actions || _wrongType(actions, types) || _invalidActions(actions)(types)) return false
  return true
}

const _isValidArgument = (actions = null) => (types = null) => (errorMsg = '') => {
  if (Array.isArray(types)) {
    const valid = types.some(type => __isValidArgument(actions)(type))
    if (!valid) console.error(new TypeError(errorMsg))
    return valid
  }

  if (!actions || _wrongType(actions, types) || _invalidActions(actions)(types)) {
    console.error(new TypeError(errorMsg))
    return false
  }
  return true
}

export { _isValidArgument }
