import { argumentError } from './helpers/builders'
import { isValid } from './helpers/validators'
import { post } from './post'
import { postAll } from './postAll'
import { register } from './register'
import { unregister } from './unregister'

export const create = (actions = [], isAsyncFunc = false) => {
  if (isValid(actions)('actionsArray')) {
    return {
      actions: actions,
      postMessage: post(actions, isAsyncFunc),
      postAll: postAll,
      register: register(actions),
      unregister: unregister(actions)
    }
  }
  console.error(argumentError({
    expected: 'an array of objects',
    received: actions,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  }))
  return null
}
