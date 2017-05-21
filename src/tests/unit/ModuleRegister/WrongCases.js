/* global test, describe, expect, jest */

export default (register) => {
  describe('register - Wrong use cases\n  Register:', () => {
    describe('Logs a warn message when', () => {
      const warn = message => `WARN! An action with message "${message}" is already registered for this worker`
      describe('does not change [actions] length and called with', () => {
        test('an already registered action (one action)', () => {
          const spy = console.warn = jest.fn()
          const registerMock = register([{ message: 'a', func: () => 'a' }])
          registerMock({ message: 'a', func: () => 'a' })
          expect(spy).toHaveBeenCalledWith(warn(`a`))
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })

        test('actions already registered (more than one)', () => {
          const spy = console.warn = jest.fn()
          const registerMock = register([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ])
          registerMock([
            { message: 'a', func: () => 'c' },
            { message: 'b', func: () => 'b' }
          ])
          expect(spy).toHaveBeenCalledWith(warn(`a`))
          expect(spy).toHaveBeenCalledWith(warn(`b`))
          expect(spy).toHaveBeenCalledTimes(2)
          return spy.mockRestore()
        })
      })
      describe('change [actions] length and called with', () => {
        test('actions already registered (more than one)', () => {
          const spy = console.warn = jest.fn()
          const registerMock = register([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ])
          registerMock([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' },
            { message: 'c', func: () => 'c' }
          ])
          expect(spy).toHaveBeenCalledWith(warn(`a`))
          expect(spy).toHaveBeenCalledWith(warn(`b`))
          expect(spy).toHaveBeenCalledTimes(2)
          return spy.mockRestore()
        })
      })
    })

    describe('Returns the length of [actions] when', () => {
      describe('does not change [actions] length and called with', () => {
        test('an already registered action (one action)', () => {
          const registerMock = register([{ message: 'a', func: () => 'a' }])
          const expected = 1
          const actual = registerMock({ message: 'a', func: () => 'a' })
          expect(actual).toBe(expected)
        })
        test('actions already registered (more than one)', () => {
          const registerMock = register([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' },
            { message: 'c', func: () => 'c' }
          ])
          const expected = 3
          const actual = registerMock([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ])
          expect(actual).toBe(expected)
        })
      })

      describe('change [actions] length and called with', () => {
        test('actions already registered (more than one)', () => {
          const registerMock = register([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ])
          const expected = 3
          const actual = registerMock([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' },
            { message: 'c', func: () => 'c' }
          ])
          expect(actual).toBe(expected)
        })
      })
    })
    describe('Logs an error when', () => {
      const error = received => new TypeError(`You should provide an array of actions or an action
Every action should be an object containing two fields:
* message
* func
Received: ${received}`)
      test('action is a string', () => {
        const spy = console.error = jest.fn()
        register([])('string')
        expect(spy).toHaveBeenCalledWith(error('"string"'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('action is an array', () => {
        const spy = console.error = jest.fn()
        register([])(['array'])
        expect(spy).toHaveBeenCalledWith(error('["array"]'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('action is an object with wrong fields', () => {
        const spy = console.error = jest.fn()
        register([])({action: 'object'})
        expect(spy).toHaveBeenCalledWith(error('{"action":"object"}'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('action is undefined', () => {
        const spy = console.error = jest.fn()
        register([])()
        expect(spy).toHaveBeenCalledWith(error('null'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('action is null', () => {
        const spy = console.error = jest.fn()
        register([])(null)
        expect(spy).toHaveBeenCalledWith(error('null'))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })

    describe('Returns null when', () => {
      test('action is a string', () => expect(register([])('string')).toBeNull())
      test('action is an array', () => expect(register([])(['array'])).toBeNull())
      test('action is an object with wrong fields', () => expect(register([])({action: 'object'})).toBeNull())
      test('action is undefined', () => expect(register([])()).toBeNull())
      test('action is null', () => expect(register([])(null)).toBeNull())
    })
  })
}
