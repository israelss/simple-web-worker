import { argumentError, isValid } from './utils'
import { post } from './post'
import { postAll } from './postAll'
import { register } from './register'
import { unregister } from './unregister'

const options = actions => {
  return {
    expected: 'an array of objects',
    received: actions,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  }
}

export const create = (actions = []) => {
  if (isValid(actions)('actionsArray')) {
    return {
      actions: actions,
      postMessage: post(actions),
      postAll: postAll,
      register: register(actions),
      unregister: unregister(actions)
    }
  }
  console.error(argumentError(options(actions)))
  return null
}
