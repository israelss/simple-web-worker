/* global test, describe, expect, jest */

export default (unregister) => {
  describe('unregister - Wrong use cases\n  Unregister:', () => {
    describe('Logs a warn message when called', () => {
      const warn = message => `WARN! Impossible to unregister action with message "${message}".\nIt is not a registered action for this worker.`

      test('with more than one action, being only one registered', () => {
        const spy = console.warn = jest.fn()
        const unregisterMock = unregister([
          { message: 'a', func: () => 'a' },
          { message: 'b', func: () => 'a' }
        ])
        unregisterMock(['a', 'c'])
        expect(spy).toHaveBeenCalledWith(warn('c'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('with one action message that is not registered', () => {
        const spy = console.warn = jest.fn()
        const unregisterMock = unregister([{ message: 'a', func: () => 'a' }])
        unregisterMock('b')
        expect(spy).toHaveBeenCalledWith(warn('b'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('with more than one action, being none registered', () => {
        const spy = console.warn = jest.fn()
        const unregisterMock = unregister([
          { message: 'a', func: () => 'a' },
          { message: 'b', func: () => 'a' }
        ])
        unregisterMock(['d', 'c'])
        expect(spy).toHaveBeenCalledWith(warn('d'))
        expect(spy).toHaveBeenCalledWith(warn('c'))
        expect(spy).toHaveBeenCalledTimes(2)
        return spy.mockRestore()
      })
    })

    describe('Returns the length of [actions] when called', () => {
      test('with more than one action, being only one registered', () => {
        const actions = [
          { message: 'a', func: () => 'a' },
          { message: 'b', func: () => 'a' }
        ]
        const unregisterMock = unregister(actions)
        const expected = 1
        const actual = unregisterMock(['a', 'c'])
        expect(actions.length).toBe(expected)
        expect(actual).toBe(expected)
      })

      test('with one action message that is not registered', () => {
        const actions = [{ message: 'a', func: () => 'a' }]
        const unregisterMock = unregister(actions)
        const expected = 1
        const actual = unregisterMock('b')
        expect(actions.length).toBe(expected)
        expect(actual).toBe(expected)
      })

      test('with more than one action, being none registered', () => {
        const actions = [
          { message: 'a', func: () => 'a' },
          { message: 'b', func: () => 'a' }
        ]
        const unregisterMock = unregister(actions)
        const expected = 2
        const actual = unregisterMock(['d', 'c'])
        expect(actions.length).toBe(expected)
        expect(actual).toBe(expected)
      })
    })

    describe('Logs an error when message is', () => {
      const error = received => new TypeError(`You should provide an array of strings or a string\n\nReceived: ${received}`)

      test('an object', () => {
        const spy = console.error = jest.fn()
        unregister([{ message: 'a', func: () => 'a' }])({an: 'object'})
        expect(spy).toHaveBeenCalledWith(error('{"an":"object"}'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('a number', () => {
        const spy = console.error = jest.fn()
        unregister([{ message: 'a', func: () => 'a' }])(1)
        expect(spy).toHaveBeenCalledWith(error('1'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('undefined', () => {
        const spy = console.error = jest.fn()
        unregister([{ message: 'a', func: () => 'a' }])()
        expect(spy).toHaveBeenCalledWith(error('null'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('null', () => {
        const spy = console.error = jest.fn()
        unregister([{ message: 'a', func: () => 'a' }])(null)
        expect(spy).toHaveBeenCalledWith(error('null'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('an array with something beside strings', () => {
        const spy = console.error = jest.fn()
        unregister([{ message: 'a', func: () => 'a' }])(['an', 'array', {with: 'object'}])
        expect(spy).toHaveBeenCalledWith(error('["an","array",{"with":"object"}]'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

    })

    describe('Returns null when message is', () => {
      test('an object', () => expect(unregister([])({an: 'object'})).toBeNull())

      test('a number', () => expect(unregister([])(1)).toBeNull())

      test('undefined', () => expect(unregister([])()).toBeNull())

      test('null', () => expect(unregister([])(null)).toBeNull())

      test('an array with something beside strings', () => expect(unregister([])(['an', 'array', {with: 'object'}])).toBeNull())
    })
  })
}
