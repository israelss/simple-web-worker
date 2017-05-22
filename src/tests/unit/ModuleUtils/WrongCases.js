/* global describe, test, expect */

export default (utilsModule) => {
  describe('utils - Wrong use cases.\n  Utils:', () => {
    describe('isValid', () => {
      test('string', () => {
        const actual = utilsModule.isValid(1)('string')
        expect(actual).toBe(false)
      })

      test('object', () => {
        const actual = utilsModule.isValid(['array'])('object')
        expect(actual).toBe(false)
      })

      test('array', () => {
        const actual = utilsModule.isValid('string')('array')
        expect(actual).toBe(false)
      })

      test('number', () => {
        const actual = utilsModule.isValid({an: 'object'})('number')
        expect(actual).toBe(false)
      })

      test('function', () => {
        const actual = utilsModule.isValid('a')('function')
        expect(actual).toBe(false)
      })

      test('undefined', () => {
        const actual = utilsModule.isValid(null)('undefined')
        expect(actual).toBe(false)
      })

      test('null', () => {
        const actual = utilsModule.isValid(undefined)('null')
        expect(actual).toBe(false)
      })

      test('action', () => {
        const actual1 = utilsModule.isValid({message: 'a', b: () => 'a'})('action')
        expect(actual1).toBe(false)
        const actual2 = utilsModule.isValid({a: 'a', func: () => 'a'})('action')
        expect(actual2).toBe(false)
        const actual3 = utilsModule.isValid({a: 'a', b: () => 'a'})('action')
        expect(actual3).toBe(false)
        const actual4 = utilsModule.isValid({message: 'a', func: 'a'})('action')
        expect(actual4).toBe(false)
        const actual5 = utilsModule.isValid({message: ['a'], func: () => 'a'})('action')
        expect(actual5).toBe(false)
      })

      test('actionsArray', () => {
        const actions = [
          ['a'],
          {message: 'b', func: () => 'b'}
        ]
        const actual = utilsModule.isValid(actions)('actionsArray')
        expect(actual).toBe(false)
      })

      test('arraysArray', () => {
        const arrays = [['a'], {message: 'b', func: () => 'b'}]
        const actual = utilsModule.isValid(arrays)('arraysArray')
        expect(actual).toBe(false)
      })

      test('objectsArray', () => {
        const objects = [
          ['a'],
          {func: () => 'b'}
        ]
        const actual = utilsModule.isValid(objects)('objectsArray')
        expect(actual).toBe(false)
      })

      test('postParamsArray', () => {
        const postParams = [
          {message: 'a', args: ['a']},
          {message: 'b', args: 'b'}
        ]
        const actual = utilsModule.isValid(postParams)('postParamsArray')
        expect(actual).toBe(false)
      })

      test('stringsArray', () => {
        const strings = ['a', ['b']]
        const actual = utilsModule.isValid(strings)('stringsArray')
        expect(actual).toBe(false)
      })
    })
  })
}
