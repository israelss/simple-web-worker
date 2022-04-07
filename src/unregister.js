import { argumentError } from './helpers/builders'
import { isValid } from './helpers/validators'

const removeFrom = actions => msg => {
  const index = actions.findIndex(({ message }) => message === msg)
  index === -1
    ? console.warn(`WARN! Impossible to unregister action with message "${msg}".
It was not found as a registered action for this worker.`)
    : actions.splice(index, 1)
  return actions
}

export const unregister = actions => (msg = null) => {
  if (isValid(msg)(['string', 'stringsArray'])) {
    if (Array.isArray(msg)) {
      return msg.reduce((actions, message) => {
        removeFrom(actions)(message)
        return actions
      }, actions).length
    }
    return removeFrom(actions)(msg).length
  }

  console.error(argumentError({
    expected: 'an array of strings or a string',
    received: msg
  }))
  return null
}
