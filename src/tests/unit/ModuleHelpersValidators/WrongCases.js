import { test, describe, expect } from '@jest/globals'

export default (validators) => {
  describe('Validators - Wrong use cases.', () => {
    describe('isValid', () => {
      test('string', () => {
        const actual = validators.isValid(1)('string')
        expect(actual).toBe(false)
      })

      test('object', () => {
        const actual = validators.isValid(['array'])('object')
        expect(actual).toBe(false)
      })

      test('array', () => {
        const actual = validators.isValid('string')('array')
        expect(actual).toBe(false)
      })

      test('number', () => {
        const actual = validators.isValid({ an: 'object' })('number')
        expect(actual).toBe(false)
      })

      test('function', () => {
        const actual = validators.isValid('a')('function')
        expect(actual).toBe(false)
      })

      test('undefined', () => {
        const actual = validators.isValid(null)('undefined')
        expect(actual).toBe(false)
      })

      test('null', () => {
        const actual = validators.isValid(undefined)('null')
        expect(actual).toBe(false)
      })

      test('action', () => {
        const actual1 = validators.isValid({ message: 'a', b: () => 'a' })('action')
        expect(actual1).toBe(false)
        const actual2 = validators.isValid({ a: 'a', func: () => 'a' })('action')
        expect(actual2).toBe(false)
        const actual3 = validators.isValid({ a: 'a', b: () => 'a' })('action')
        expect(actual3).toBe(false)
        const actual4 = validators.isValid({ message: 'a', func: 'a' })('action')
        expect(actual4).toBe(false)
        const actual5 = validators.isValid({ message: ['a'], func: () => 'a' })('action')
        expect(actual5).toBe(false)
      })

      test('actionsArray', () => {
        const actions = [
          ['a'],
          { message: 'b', func: () => 'b' }
        ]
        const actual = validators.isValid(actions)('actionsArray')
        expect(actual).toBe(false)
      })

      test('arraysArray', () => {
        const arrays = [['a'], { message: 'b', func: () => 'b' }]
        const actual = validators.isValid(arrays)('arraysArray')
        expect(actual).toBe(false)
      })

      test('objectsArray', () => {
        const objects = [
          ['a'],
          { func: () => 'b' }
        ]
        const actual = validators.isValid(objects)('objectsArray')
        expect(actual).toBe(false)
      })

      test('postParamsArray', () => {
        const postParams = [
          { message: 'a', args: ['a'] },
          { message: 'b', args: 'b' }
        ]
        const actual = validators.isValid(postParams)('postParamsArray')
        expect(actual).toBe(false)
      })

      test('stringsArray', () => {
        const strings = ['a', ['b']]
        const actual = validators.isValid(strings)('stringsArray')
        expect(actual).toBe(false)
      })
    })
  })
}
