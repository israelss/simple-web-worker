/* global describe, test, expect, jest */

export default (post, actions, externalModule) => {
  describe('post - Wrong use cases.\n  Post:', () => {
    describe('Doesn\'t calls run', () => {
      describe('when message', () => {
        test('is an object', () => {
          const spy = console.error = jest.fn()
          post({f: 'func1'})
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })

        test('is an array', () => {
          const spy = console.error = jest.fn()
          post(['func1'])
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })

        test('is a number', () => {
          const spy = console.error = jest.fn()
          post(1)
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })

        test('is null', () => {
          const spy = console.error = jest.fn()
          post(null)
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })

        test('is undefined', () => {
          const spy = console.error = jest.fn()
          post()
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })
      })
      describe('when args', () => {
        test('is an object', () => {
          const spy = console.error = jest.fn()
          post('func1', {arg: 'arg1'})
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })
        test('is a string', () => {
          const spy = console.error = jest.fn()
          post('func1', 'arg1')
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })
        test('is a number', () => {
          const spy = console.error = jest.fn()
          post('func1', 1)
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })
        test('is null', () => {
          const spy = console.error = jest.fn()
          post('func1', null)
          expect(externalModule.run).not.toHaveBeenCalled()
          return spy.mockRestore()
        })
      })
    })
    describe('Logs a warn', () => {
      describe('when message', () => {
        test('is an inexistent action', () => {
          const warn = 'WARN! "Darth Vader" is not a registered action for this worker'
          const spy = console.warn = jest.fn()
          post('Darth Vader')
          expect(spy).toHaveBeenCalledWith(warn)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
      })
    })

    describe('Returns a warn message', () => {
      describe('when message', () => {
        test('is an inexistent action', () => {
          expect.assertions(1)
          return expect(post('Darth Vader')).resolves.toBe('"Darth Vader" is not a registered action for this worker')
        })
      })
    })

    describe('Logs an error', () => {
      describe('when message', () => {
        test('is an object', () => {
          const error = new TypeError('You should provide a string\n\nReceived: {"f":"func1"}')
          const spy = console.error = jest.fn()
          post({f: 'func1'})
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('is an array', () => {
          const error = new TypeError('You should provide a string\n\nReceived: ["func1"]')
          const spy = console.error = jest.fn()
          post(['func1'])
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('is a number', () => {
          const error = new TypeError('You should provide a string\n\nReceived: 1')
          const spy = console.error = jest.fn()
          post(1)
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('is null', () => {
          const error = new TypeError('You should provide a string\n\nReceived: null')
          const spy = console.error = jest.fn()
          post(null)
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('is undefined', () => {
          const error = new TypeError('You should provide a string\n\nReceived: null')
          const spy = console.error = jest.fn()
          post()
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
      })
      describe('when args', () => {
        test('is an object', () => {
          const error = new TypeError('You should provide an array\n\nReceived: {"arg":"arg1"}')
          const spy = console.error = jest.fn()
          post('func1', {arg: 'arg1'})
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('is a string', () => {
          const error = new TypeError('You should provide an array\n\nReceived: "arg1"')
          const spy = console.error = jest.fn()
          post('func1', 'arg1')
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('is a number', () => {
          const error = new TypeError('You should provide an array\n\nReceived: 1')
          const spy = console.error = jest.fn()
          post('func1', 1)
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
        test('is null', () => {
          const error = new TypeError('You should provide an array\n\nReceived: null')
          const spy = console.error = jest.fn()
          post('func1', null)
          expect(spy).toHaveBeenCalledWith(error)
          expect(spy).toHaveBeenCalledTimes(1)
          return spy.mockRestore()
        })
      })
    })

    describe('Returns null', () => {
      describe('when message', () => {
        test('is an object', () => expect(post({f: 'func1'})).toBeNull())
        test('is an array', () => expect(post(['func1'])).toBeNull())
        test('is a number', () => expect(post(1)).toBeNull())
        test('is null', () => expect(post(null)).toBeNull())
        test('is undefined', () => expect(post()).toBeNull())
      })
      describe('when args', () => {
        test('is an object', () => expect(post('func1', {arg: 'arg1'})).toBeNull())
        test('is a string', () => expect(post('func1', 'arg1')).toBeNull())
        test('is a number', () => expect(post('func1', 1)).toBeNull())
        test('is null', () => expect(post('func1', null)).toBeNull())
      })
    })
  })
}
