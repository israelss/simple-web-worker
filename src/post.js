import { argumentError, isValid } from './utils'
import { run } from './run'

const warnWork = msg => {
  console.warn(`WARN! ${msg} is not a registered action for this worker`)
  return `${msg} is not a registered action for this worker`
}

export const post = actions => (msg = null, args) => {
  const validMessage = isValid(msg)('string')
  const validArgs = isValid(args)(['array', 'undefined'])
  if (validMessage && validArgs) {
    const work = actions
      .filter(({ message }) => JSON.stringify(message) === JSON.stringify(msg))
      .map(action => action.func)
      .pop()

    if (!work) return run(warnWork, [JSON.stringify(msg)])
    if (args) return run(work, args)
    return run(work)
  }

  if (!validMessage) console.error(argumentError({ expected: 'a string', received: msg }))
  if (!validArgs) console.error(argumentError({ expected: 'an array', received: args }))
  return null
}
