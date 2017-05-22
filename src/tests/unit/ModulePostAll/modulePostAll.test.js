import CorrectCases from './CorrectCases'
import WrongCases from './WrongCases'
import { postAll } from '../../../postAll'

const warnWork = msg => {
  console.warn(`WARN! ${msg} is not a registered action for this worker`)
  return `${msg} is not a registered action for this worker`
}

const actions = [
  { message: 'a', func: () => 'a' },
  { message: 'b', func: () => 'b' },
  { message: 'c', func: arg => arg },
  { message: 'd', func: (arg = 'default') => arg }
]

const postMessage = (msg, args) => {
  const work = actions
    .filter(({ message }) => JSON.stringify(message) === JSON.stringify(msg))
    .map(action => action.func)
    .pop()
  if (!work) return Promise.resolve(warnWork(JSON.stringify(msg)))
  if (args) return Promise.resolve(work.apply(null, args))
  return Promise.resolve((work)())
}

const worker = {
  actions,
  postAll,
  postMessage
}

CorrectCases(worker)
WrongCases(worker)
