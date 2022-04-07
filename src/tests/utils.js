const JSONreplacer = (_key, value) => {
  if (value instanceof Function) return value.toString()
  if (value === undefined) return 'undefined'
  return value
}

export const stringify = (msg, replacer = JSONreplacer) => JSON.stringify(msg, replacer)
