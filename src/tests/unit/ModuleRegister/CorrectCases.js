/* global test, describe, expect */

const replacer = (key, value) => {
  if (value instanceof Function) return value.toString()
  return value
}

export default (register) => {
  describe('register - Correct use cases\n  Register:', () => {
    describe('When have no previous registered actions', () => {
      describe('Returns correctly when called', () => {
        test('with one action', () => {
          const registerMock = register([])
          const expected = 1
          const actual = registerMock({ message: 'a', func: () => 'a' })
          expect(actual).toBe(expected)
        })
        test('with more than one action', () => {
          const registerMock = register([])
          const expected = 2
          const actual = registerMock([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ])
          expect(actual).toBe(expected)
        })
      })

      describe('Update [actions] correctly when called', () => {
        test('with one action', () => {
          const actions = []
          const registerMock = register(actions)
          const expected = JSON.stringify([{ message: 'a', func: () => 'a' }], replacer)
          registerMock({ message: 'a', func: () => 'a' })
          expect(JSON.stringify(actions, replacer)).toEqual(expected)
        })
        test('with more than one action', () => {
          const actions = []
          const registerMock = register(actions)
          const expected = JSON.stringify([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ], replacer)
          registerMock([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ])
          expect(JSON.stringify(actions, replacer)).toEqual(expected)
        })
      })
    })

    describe('When have previous registered actions', () => {
      describe('Returns correctly when called', () => {
        test('with one action', () => {
          const registerMock = register([{ message: 'b', func: () => 'b' }])
          const expected = 2
          const actual = registerMock({ message: 'a', func: () => 'a' })
          expect(actual).toBe(expected)
        })
        test('with more than one action', () => {
          const registerMock = register([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ])
          const expected = 4
          const actual = registerMock([
            { message: 'c', func: () => 'c' },
            { message: 'd', func: () => 'd' }
          ])
          expect(actual).toBe(expected)
        })
      })

      describe('Update [actions] correctly when called', () => {
        test('with one action', () => {
          const actions = [{ message: 'b', func: () => 'b' }]
          const registerMock = register(actions)
          const expected = JSON.stringify([
            { message: 'b', func: () => 'b' },
            { message: 'a', func: () => 'a' }
          ], replacer)
          registerMock({ message: 'a', func: () => 'a' })
          expect(JSON.stringify(actions, replacer)).toEqual(expected)
        })
        test('with more than one action', () => {
          const actions = [
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ]
          const registerMock = register(actions)
          const expected = JSON.stringify([
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' },
            { message: 'c', func: () => 'c' },
            { message: 'd', func: () => 'd' }
          ], replacer)
          registerMock([
            { message: 'c', func: () => 'c' },
            { message: 'd', func: () => 'd' }
          ])
          expect(JSON.stringify(actions, replacer)).toEqual(expected)
        })
      })
    })
  })
}
