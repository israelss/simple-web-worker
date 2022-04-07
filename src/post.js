import { argumentError } from './helpers/builders'
import { isValid } from './helpers/validators'
import { run } from './run'

const warnWork = msg => {
  const message = `${msg} is not a registered action for this worker`
  console.warn(`WARN! ${message}`)
  return message
}

export const post = (actions, isAsyncFunc) => (msg = null, args) => {
  const validMessage = isValid(msg)('string')
  const validArgs = isValid(args)(['array', 'undefined'])
  if (validMessage && validArgs) {
    const work = actions
      .filter(({ message }) => JSON.stringify(message) === JSON.stringify(msg))
      .map(action => action.func)
      .pop()

    if (!work) return run(warnWork, [JSON.stringify(msg)])
    if (args) return run(work, args, isAsyncFunc)
    return run(work, undefined, isAsyncFunc)
  }

  if (!validMessage) console.error(argumentError({ expected: 'a string', received: msg }))
  if (!validArgs) console.error(argumentError({ expected: 'an array', received: args }))
  return null
}
