import { test, describe, expect } from '@jest/globals'

export default (validators) => {
  describe('Validators - Correct use cases.', () => {
    describe('isValid', () => {
      describe('types is not an Array', () => {
        test('string', () => {
          const actual = validators.isValid('string')('string')
          expect(actual).toBe(true)
        })

        test('object', () => {
          const actual = validators.isValid({ an: 'object' })('object')
          expect(actual).toBe(true)
        })

        test('array', () => {
          const actual = validators.isValid(['array'])('array')
          expect(actual).toBe(true)
        })

        test('number', () => {
          const actual = validators.isValid(1)('number')
          expect(actual).toBe(true)
        })

        test('function', () => {
          const actual = validators.isValid(() => 'a')('function')
          expect(actual).toBe(true)
        })

        test('undefined', () => {
          const actual = validators.isValid()('undefined')
          expect(actual).toBe(true)
        })

        test('null', () => {
          const actual = validators.isValid(null)('null')
          expect(actual).toBe(true)
        })

        test('action', () => {
          const actual = validators.isValid({ message: 'a', func: () => 'a' })('action')
          expect(actual).toBe(true)
        })

        test('actionsArray', () => {
          const actions = [
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ]
          const actual = validators.isValid(actions)('actionsArray')
          expect(actual).toBe(true)
        })

        test('arraysArray', () => {
          const arrays = [['a'], ['b']]
          const actual = validators.isValid(arrays)('arraysArray')
          expect(actual).toBe(true)
        })

        test('objectsArray', () => {
          const objects = [
            { message: 'a' },
            { func: () => 'b' }
          ]
          const actual = validators.isValid(objects)('objectsArray')
          expect(actual).toBe(true)
        })

        test('postParamsArray', () => {
          const postParams = [
            { message: 'a', args: ['a'] },
            { message: 'b', args: ['b'] }
          ]
          const actual = validators.isValid(postParams)('postParamsArray')
          expect(actual).toBe(true)
        })

        test('stringsArray', () => {
          const strings = ['a', 'b']
          const actual = validators.isValid(strings)('stringsArray')
          expect(actual).toBe(true)
        })
      })

      describe('types is an Array', () => {
        describe('[\'array\', \'undefined\']', () => {
          test('array', () => {
            const actual = validators.isValid([])(['array', 'undefined'])
            expect(actual).toBe(true)
          })

          test('undefined', () => {
            const actual = validators.isValid()(['array', 'undefined'])
            expect(actual).toBe(true)
          })
        })

        describe('[\'string\', \'stringsArray\']', () => {
          test('string', () => {
            const actual = validators.isValid('string')(['string', 'stringsArray'])
            expect(actual).toBe(true)
          })

          test('stringsArray', () => {
            const actual = validators.isValid(['string', 'stringsArray'])(['string', 'stringsArray'])
            expect(actual).toBe(true)
          })
        })

        describe('[\'action\', \'actionsArray\']', () => {
          test('action', () => {
            const actual = validators.isValid({ message: 'a', func: () => 'a' })(['action', 'actionsArray'])
            expect(actual).toBe(true)
          })

          test('actionsArray', () => {
            const actions = [
              { message: 'a', func: () => 'a' },
              { message: 'b', func: () => 'b' }
            ]
            const actual = validators.isValid(actions)(['action', 'actionsArray'])
            expect(actual).toBe(true)
          })
        })

        describe('[\'arraysArray\', \'postParamsArray\', \'stringsArray\']', () => {
          test('arraysArray', () => {
            const arrays = [['a'], ['b']]
            const actual = validators.isValid(arrays)(['arraysArray', 'postParamsArray', 'stringsArray'])
            expect(actual).toBe(true)
          })

          test('postParamsArray', () => {
            const postParams = [
              { message: 'a', args: ['a'] },
              { message: 'b', args: ['b'] }
            ]
            const actual = validators.isValid(postParams)(['arraysArray', 'postParamsArray', 'stringsArray'])
            expect(actual).toBe(true)
          })

          test('stringsArray', () => {
            const strings = ['a', 'b']
            const actual = validators.isValid(strings)(['arraysArray', 'postParamsArray', 'stringsArray'])
            expect(actual).toBe(true)
          })
        })
      })
    })
  })
}
