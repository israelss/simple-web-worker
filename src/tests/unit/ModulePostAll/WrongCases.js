/* global describe, test, jest, expect */

const buildError = received =>
  new TypeError(`You should provide an array of arrays, an array of objects, or an array of strings
If an array of arrays, it must have the same length as the actions registered for this worker.
If an array of objects, every object must containing two fields:
* message
* args
Received: ${JSON.stringify(received)}`)

export default (worker) => {
  describe('postAll - Wrong use cases.\n  PostAll:', () => {
    describe('Logs an error message when called with', () => {
      test('an array with different length from [actions]', () => {
        const error = buildError([['a']])
        const spy = console.error = jest.fn()
        worker.postAll([['a']])
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('a string', () => {
        const error = buildError('a string')
        const spy = console.error = jest.fn()
        worker.postAll('a string')
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('an object', () => {
        const error = buildError({an: 'object'})
        const spy = console.error = jest.fn()
        worker.postAll({an: 'object'})
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('a number', () => {
        const error = buildError(1)
        const spy = console.error = jest.fn()
        worker.postAll(1)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('null', () => {
        const error = buildError(null)
        const spy = console.error = jest.fn()
        worker.postAll(null)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('a mixed array (string and object)', () => {
        const error = buildError(['a', { message: 'b', args: [] }])
        const spy = console.error = jest.fn()
        worker.postAll(['a', { message: 'b', args: [] }])
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('a mixed array (string and array)', () => {
        const error = buildError(['a', ['b']])
        const spy = console.error = jest.fn()
        worker.postAll(['a', ['b']])
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('a mixed array (array and object)', () => {
        const error = buildError([['a'], { message: 'b', args: [] }])
        const spy = console.error = jest.fn()
        worker.postAll([['a'], { message: 'b', args: [] }])
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('a mixed array (string, array and object)', () => {
        const error = buildError(['a', ['b'], { message: 'c', args: [] }])
        const spy = console.error = jest.fn()
        worker.postAll(['a', ['b'], { message: 'c', args: [] }])
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('a wrong array (number)', () => {
        const error = buildError([1, 2, 3])
        const spy = console.error = jest.fn()
        worker.postAll([1, 2, 3])
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('a wrong array (null)', () => {
        const error = buildError([null, null, null])
        const spy = console.error = jest.fn()
        worker.postAll([null, null, null])
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('a wrong array (undefined)', () => {
        const error = buildError([undefined, undefined])
        const spy = console.error = jest.fn()
        worker.postAll([undefined, undefined])
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('a wrong objects array (wrong fields)', () => {
        const error1 = buildError([{ a: 'a', args: [] }])
        const error2 = buildError([{ message: 'a', b: [] }])
        const error3 = buildError([{ a: 'a', b: [] }])
        const spy = console.error = jest.fn()
        worker.postAll([{ a: 'a', args: [] }])
        worker.postAll([{ message: 'a', b: [] }])
        worker.postAll([{ a: 'a', b: [] }])
        expect(spy).toHaveBeenCalledWith(error1)
        expect(spy).toHaveBeenCalledWith(error2)
        expect(spy).toHaveBeenCalledWith(error3)
        expect(spy).toHaveBeenCalledTimes(3)
        return spy.mockRestore()
      })
    })

    describe('Returns null when called with', () => {
      test('an array with different length from [actions]', () => {
        return expect(worker.postAll([['a']])).toBeNull()
      })

      test('a string', () => expect(worker.postAll('a string')).toBeNull())

      test('an object', () => expect(worker.postAll({an: 'object'})).toBeNull())

      test('a number', () => expect(worker.postAll(1)).toBeNull())

      test('null', () => expect(worker.postAll(null)).toBeNull())

      test('a mixed array (string and object)', () => {
        return expect(worker.postAll(['a', { message: 'b', args: [] }])).toBeNull()
      })
      test('a mixed array (string and array)', () => {
        return expect(worker.postAll(['a', ['b']])).toBeNull()
      })
      test('a mixed array (array and object)', () => {
        return expect(worker.postAll([['a'], { message: 'b', args: [] }])).toBeNull()
      })
      test('a mixed array (string, array and object)', () => {
        return expect(worker.postAll(['a', ['b'], { message: 'c', args: [] }])).toBeNull()
      })

      test('a wrong array (number)', () => {
        return expect(worker.postAll([1, 2, 3])).toBeNull()
      })
      test('a wrong array (null)', () => {
        return expect(worker.postAll([null, null, null])).toBeNull()
      })
      test('a wrong array (undefined)', () => {
        return expect(worker.postAll([undefined, undefined])).toBeNull()
      })

      test('a wrong objects array (wrong fields)', () => {
        const wrongMessage = expect(worker.postAll([{ a: 'a', args: [] }]))
        const wrongArgs = expect(worker.postAll([{ message: 'a', b: [] }]))
        const bothWrong = expect(worker.postAll([{ a: 'a', b: [] }]))
        return wrongMessage.toBeNull() && wrongArgs.toBeNull() && bothWrong.toBeNull()
      })
    })
  })
}
