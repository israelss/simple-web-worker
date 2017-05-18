/* global test, describe, expect */

export default (run, externalModule) => {
  describe('run - Correct use cases\n  Run:', () => {
    describe('Calls `createDisposableWorker` once when', () => {
      test('called without arrow function', () => {
        run(function () { return 'Run without args and without arrow function' })
        expect(externalModule.createDisposableWorker).toHaveBeenCalledTimes(1)
      })
      test('called with arrow function', () => {
        run(() => 'Run without args and with arrow function')
        expect(externalModule.createDisposableWorker).toHaveBeenCalledTimes(1)
      })
      test('expecting args as input', () => {
        run((arg1, arg2) => `Run ${arg1} and ${arg2}`)
        expect(externalModule.createDisposableWorker).toHaveBeenCalledTimes(1)
      })
      test('expecting a string as return', () => {
        run(() => `Returned string`)
        expect(externalModule.createDisposableWorker).toHaveBeenCalledTimes(1)
      })
      test('expecting a number as return', () => {
        run(() => 1 + 2)
        expect(externalModule.createDisposableWorker).toHaveBeenCalledTimes(1)
      })
      test('expecting an object as return', () => {
        run(() => { return { ret: 'Returned object' } })
        expect(externalModule.createDisposableWorker).toHaveBeenCalledTimes(1)
      })
      test('expecting an array as return', () => {
        run(() => ['Returned array'])
        expect(externalModule.createDisposableWorker).toHaveBeenCalledTimes(1)
      })
    })

    describe('Returns correctly when called', () => {
      describe('without args and', () => {
        test('without arrow function', () => {
          const expected = 'Run without args and without arrow function'
          const actual = run(function () {
            return 'Run without args and without arrow function'
          })
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('with arrow function', () => {
          const expected = 'Run without args and with arrow function'
          const actual = run(() => 'Run without args and with arrow function')
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('expecting args as input', () => {
          const expected = 'Run undefined and undefined'
          const actual = run((arg1, arg2) => `Run ${arg1} and ${arg2}`)
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('expecting a string as return', () => {
          const expected = 'Returned string'
          const actual = run(() => `Returned string`)
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('expecting a number as return', () => {
          const expected = 3
          const actual = run(() => 1 + 2)
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('expecting an object as return', () => {
          const expected = { ret: 'Returned object' }
          const actual = run(() => { return { ret: 'Returned object' } })
          expect.assertions(1)
          return expect(actual).resolves.toEqual(expected)
        })
        test('expecting an array as return', () => {
          const expected = ['Returned array']
          const actual = run(() => ['Returned array'])
          expect.assertions(1)
          return expect(actual).resolves.toEqual(expected)
        })
      })

      describe('with args and', () => {
        test('without arrow function', () => {
          const expected = 'Run with args and without arrow function'
          const actual = run(function (arg1, arg2) {
            return `Run ${arg1} and ${arg2}`
          }, ['with args', 'without arrow function'])
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('with arrow function', () => {
          const expected = 'Run with args and with arrow function'
          const actual = run((arg1, arg2) =>
            `Run ${arg1} and ${arg2}`, ['with args', 'with arrow function'])
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('have default arg value && args === undefined', () => {
          const expected = 'Run with default arg value'
          const actual = run((arg1 = 'default arg value') =>
            `Run with ${arg1}`, undefined)
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('does not have default arg value && args === undefined', () => {
          const expected = 'Run with undefined'
          const actual = run((arg1) => `Run with ${arg1}`, undefined)
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('expecting a string as return', () => {
          const expected = 'Returned string'
          const actual = run((arg) => `Returned ${arg}`, ['string'])
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('expecting a number as return', () => {
          const expected = 3
          const actual = run((arg) => arg + 2, [1])
          expect.assertions(1)
          return expect(actual).resolves.toBe(expected)
        })
        test('expecting an object as return', () => {
          const expected = { ret: 'object' }
          const actual = run((arg) => arg, [{ ret: 'object' }])
          expect.assertions(1)
          return expect(actual).resolves.toEqual(expected)
        })
        test('expecting an array as return', () => {
          const expected = ['array']
          const actual = run((arg) => arg, [['array']])
          expect.assertions(1)
          return expect(actual).resolves.toEqual(expected)
        })
      })
    })
  })
}
