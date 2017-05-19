import { argumentError, isValid } from './utils'

const removeFrom = actions => action => {
  const index = actions.findIndex(({ message }) => message === action)
  if (index === -1) {
    console.warn(`WARN! Impossible to unregister ${action}.\n${action} is not a registered action for this worker.`)
    return []
  }
  return actions.splice(index, 1)
}

export const unregister = actions => (msg = null) => {
  const options = {
    expected: 'an array of strings or a string',
    received: msg
  }
  if (isValid(msg)(['string', 'stringsArray'])(argumentError(options))) {
    const remove = removeFrom(actions)

    if (Array.isArray(msg)) {
      const removed = msg.reduce((removed, action) => {
        removed = removed.concat(remove(action))
        return removed
      }, [])

      if (removed.length === 0) {
        console.warn(`WARN! Impossible to unregister ${JSON.stringify(msg)}.` +
                    '\nNone of the actions is a registered action for this worker.')
        return null
      }
      return removed
    }

    return remove(msg)
  }

  return null
}
