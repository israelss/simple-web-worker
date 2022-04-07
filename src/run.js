import { argumentError, makeAsyncResponse, makeResponse } from './helpers/builders'
import { isValid } from './helpers/validators'
import { createDisposableWorker } from './createDisposableWorker'

export const run = (work = null, args, isAsyncFunc = false) => {
  const validWork = isValid(work)('function')
  const validArgs = isValid(args)(['array', 'undefined'])
  if (validWork && validArgs) {
    const response = isAsyncFunc ? makeAsyncResponse(work) : makeResponse(work)
    const worker = createDisposableWorker(response, isAsyncFunc)
    return worker.post({ args })
  }
  if (!validWork) {
    console.error(argumentError({
      expected: 'a function',
      received: work
    }))
  }
  if (!validArgs) {
    console.error(argumentError({
      expected: 'an array',
      received: args
    }))
  }
  return null
}
