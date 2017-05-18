import { argumentError, isValidArgument, makeResponse } from './utils'
import { createDisposableWorker } from './createDisposableWorker'

export const run = (work = null, args) => {
  if (!isValidArgument(work)('function')(argumentError({ expected: 'a function', received: work }))) {
    return null
  }
  if (!isValidArgument(args)(['array', 'undefined'])(argumentError({ expected: 'an array', received: args }))) {
    return null
  }
  const response = makeResponse(work)
  return createDisposableWorker(response).post({ args })
}
