/* global test, describe, expect, jest */

export default (run, externalModule) => {
  describe('run - Wrong use cases\n  Run:', () => {
    describe('Logs an error when', () => {
      describe('work is', () => {
        test('a string', () => {
          const error = new TypeError(`You should provide a function\n\nReceived: "Run with string"`)
          const spy = console.error = jest.fn()
          run('Run with string')
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('an object', () => {
          const error = new TypeError(`You should provide a function\n\nReceived: {"work":"Run with object"}`)
          const spy = console.error = jest.fn()
          run({work: 'Run with object'})
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('undefined', () => {
          const error = new TypeError(`You should provide a function\n\nReceived: null`)
          const spy = console.error = jest.fn()
          run()
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('null', () => {
          const error = new TypeError(`You should provide a function\n\nReceived: null`)
          const spy = console.error = jest.fn()
          run(null)
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
      })

      describe('args is', () => {
        test('a string', () => {
          const error = new TypeError(`You should provide an array\n\nReceived: "undefined"`)
          const spy = console.error = jest.fn()
          run((arg1) => `Run with ${arg1}`, 'undefined')
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('an object', () => {
          const error = new TypeError(`You should provide an array\n\nReceived: {"arg1":"undefined"}`)
          const spy = console.error = jest.fn()
          run((arg1) => `Run with ${arg1}`, {arg1: 'undefined'})
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('null', () => {
          const error = new TypeError(`You should provide an array\n\nReceived: null`)
          const spy = console.error = jest.fn()
          run((arg1) => `Run with ${arg1}`, null)
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
      })
    })

    describe('Returns null when', () => {
      describe('work is', () => {
        test('a string', () =>
          expect(run('Run with string')).toBeNull())

        test('an object', () =>
          expect(run({work: 'Run with object'})).toBeNull())

        test('undefined', () =>
          expect(run()).toBeNull())

        test('null', () =>
          expect(run(null)).toBeNull())
      })

      describe('args is', () => {
        test('a string', () =>
          expect(run((arg1) => `Run with ${arg1}`, 'undefined')).toBeNull())

        test('an object', () =>
          expect(run((arg1) => `Run with ${arg1}`, {arg1: 'undefined'})).toBeNull())

        test('null', () =>
          expect(run((arg1) => `Run with ${arg1}`, null)).toBeNull())
      })
    })

    describe('Doesn\'t calls `createDisposableWorker` when', () => {
      describe('work is', () => {
        test('a string', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('an object', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('undefined', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('null', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())
      })

      describe('args is', () => {
        test('a string', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('an object', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('null', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())
      })
    })
  })
}
