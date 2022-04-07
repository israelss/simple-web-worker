import { jest, afterEach, beforeEach, afterAll } from '@jest/globals'
import CorrectCases from './CorrectCases'
import WrongCases from './WrongCases'
import { run } from '../../../run'
import * as externalModule from '../../../createDisposableWorker'
import * as builders from '../../../helpers/builders'

jest.spyOn(builders, 'makeResponse').mockImplementation(work => work)
jest.mock('../../../createDisposableWorker')

afterEach(() => {
  jest.clearAllMocks()
})

beforeEach(() => {
  externalModule
    .createDisposableWorker
    .mockImplementation(response => {
      return {
        post: obj => {
          if (obj.args) return Promise.resolve(response.apply(null, obj.args))
          return Promise.resolve(response())
        }
      }
    })
})
afterAll(() => {
  jest.resetAllMocks()
})

CorrectCases(run, externalModule)
WrongCases(run, externalModule)
