/* global describe, test, expect, jest */

const errorMsg = received =>
`You should provide an array of objects
Every action should be an object containing two fields:
* message
* func
Received: ${received}`

export default (create) => {
  describe('create - Wrong use cases.\n  Create:', () => {
    describe('Logs an error when the argument is', () => {
      test('an object', () => {
        const spy = console.error = jest.fn()
        create({a: '1'})
        expect(spy).toHaveBeenCalledWith(new TypeError(errorMsg('{"a":"1"}')))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('a string', () => {
        const spy = console.error = jest.fn()
        create('action')
        expect(spy).toHaveBeenCalledWith(new TypeError(errorMsg('"action"')))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('null', () => {
        const spy = console.error = jest.fn()
        create(null)
        expect(spy).toHaveBeenCalledWith(new TypeError(errorMsg('null')))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('an array of objects without correct fields', () => {
        const spy = console.error = jest.fn()
        create([{a: 'a', b: 'b'}])
        expect(spy).toHaveBeenCalledWith(new TypeError(errorMsg('[{"a":"a","b":"b"}]')))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('an array of strings', () => {
        const spy = console.error = jest.fn()
        create(['a', 'b'])
        expect(spy).toHaveBeenCalledWith(new TypeError(errorMsg('["a","b"]')))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })

      test('an array of arrays', () => {
        const spy = console.error = jest.fn()
        create([['a'], ['b']])
        expect(spy).toHaveBeenCalledWith(new TypeError(errorMsg('[["a"],["b"]]')))
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })

    describe('Returns null when the argument is', () => {
      test('an object', () => expect(create({a: '1'})).toBeNull())
      test('an string', () => expect(create('action')).toBeNull())
      test('null', () => expect(create(null)).toBeNull())
      test('an array of objects without correct fields', () => expect(create([{a: 'a', b: 'b'}])).toBeNull())
      test('an array of strings', () => expect(create(['a', 'b'])).toBeNull())
      test('an array of arrays', () => expect(create([['a'], ['b']])).toBeNull())
    })
  })
}
