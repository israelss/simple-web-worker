import { _isValidArgument } from './utils'

const _removeFrom = actions => action => {
  const index = actions.findIndex(({ message }) => message === action)
  if (index === -1) {
    console.warn(`WARN! Impossible to unregister ${action}.\n${action} is not a registered action for this worker.`)
    return []
  }
  return actions.splice(index, 1)
}

const errorMsg = msg => `You should provide an array of strings or a string.\nReceived: ${JSON.stringify(msg)}`

const _unregister = actions => (msg = null) => {
  if (_isValidArgument(msg)(['string', 'stringsArray'])(errorMsg(msg))) {
    const remove = _removeFrom(actions)

    if (Array.isArray(msg)) {
      const removed = msg.reduce((removed, action) => {
        removed = removed.concat(remove(action))
        return removed
      }, [])

      if (removed.length === 0) {
        console.warn(`WARN! Impossible to unregister ${JSON.stringify(msg)}.\nNone of the actions is a registered action for this worker.`)
        return null
      }
      return removed
    }
    return remove(msg)
  }

  return null
}

export { _unregister }
