/* global jest, beforeEach, afterAll */
import CorrectCases from './CorrectCases'
import WrongCases from './WrongCases'
import { run } from '../../../run'
import * as utils from '../../../utils'
import * as externalModule from '../../../createDisposableWorker'

jest.spyOn(utils, 'makeResponse').mockImplementation(work => work)
beforeEach(() => {
  externalModule.createDisposableWorker = jest.fn(response => {
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
