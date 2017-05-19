/* global jest, beforeEach */
import CorrectCases from './CorrectCases'
import WrongCases from './WrongCases'
import { post } from '../../../post'
import * as externalModule from '../../../run'

const actions = [
  { message: 'func1', func: () => `Worker 1: Working on func1` },
  { message: 'func2', func: arg => `Worker 2: ${arg}` },
  { message: 'func3', func: arg => `Worker 3: ${arg}` },
  { message: 'func4', func: (arg = 'Working on func4') => `Worker 4: ${arg}` }
]
const postMock = post(actions)
beforeEach(() => {
  externalModule.run = jest.fn((work = null, args) => {
    if (args) return Promise.resolve(work.apply(null, args))
    return Promise.resolve(work())
  })
})

CorrectCases(postMock, actions, externalModule)
WrongCases(postMock, actions, externalModule)
