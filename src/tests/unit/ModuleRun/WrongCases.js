/* global test, describe, expect, jest */

export default (run, externalModule) => {
  describe('run - Wrong use cases\n  Run:', () => {
    describe('Logs an error when', () => {
      test('typeof work === "string"', () => {
        const error = new TypeError(`You should provide a function\n\nReceived: "Run with string"`)
        const spy = console.error = jest.fn()
        run('Run with string')
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('typeof work === "object"', () => {
        const error = new TypeError(`You should provide a function\n\nReceived: {"work":"Run with object"}`)
        const spy = console.error = jest.fn()
        run({work: 'Run with object'})
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('typeof work === "undefined"', () => {
        const error = new TypeError(`You should provide a function\n\nReceived: null`)
        const spy = console.error = jest.fn()
        run()
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('typeof work === "null"', () => {
        const error = new TypeError(`You should provide a function\n\nReceived: null`)
        const spy = console.error = jest.fn()
        run(null)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('typeof args === "string"', () => {
        const error = new TypeError(`You should provide an array\n\nReceived: "undefined"`)
        const spy = console.error = jest.fn()
        run((arg1) => `Run with ${arg1}`, 'undefined')
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('typeof args === "object"', () => {
        const error = new TypeError(`You should provide an array\n\nReceived: {"arg1":"undefined"}`)
        const spy = console.error = jest.fn()
        run((arg1) => `Run with ${arg1}`, {arg1: 'undefined'})
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('typeof args === "null"', () => {
        const error = new TypeError(`You should provide an array\n\nReceived: null`)
        const spy = console.error = jest.fn()
        run((arg1) => `Run with ${arg1}`, null)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })

    describe('Returns null when', () => {
      test('typeof work === "string"', () =>
        expect(run('Run with string')).toBeNull())

      test('typeof work === "object"', () =>
        expect(run({work: 'Run with object'})).toBeNull())

      test('typeof work === "undefined"', () =>
        expect(run()).toBeNull())

      test('typeof work === "null"', () =>
        expect(run(null)).toBeNull())

      test('typeof args === "string"', () =>
        expect(run((arg1) => `Run with ${arg1}`, 'undefined')).toBeNull())

      test('typeof args === "object"', () =>
        expect(run((arg1) => `Run with ${arg1}`, {arg1: 'undefined'})).toBeNull())

      test('typeof args === "null"', () =>
        expect(run((arg1) => `Run with ${arg1}`, null)).toBeNull())
    })

    describe('Doesn\'t calls `createDisposableWorker when`', () => {
      test('typeof work === "string"', () =>
        expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

      test('typeof work === "object"', () =>
        expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

      test('typeof work === "undefined"', () =>
        expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

      test('typeof work === "null"', () =>
        expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

      test('typeof args === "string"', () =>
        expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

      test('typeof args === "object"', () =>
        expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

      test('typeof args === "null"', () =>
        expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())
    })
  })
}
