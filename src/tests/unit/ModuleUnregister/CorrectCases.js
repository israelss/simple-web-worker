/* global test, describe, expect */

const JSONreplacer = (key, value) => {
  if (value instanceof Function) return value.toString()
  return value
}

const stringify = (msg, replacer = JSONreplacer) => JSON.stringify(msg, replacer)

export default (unregister) => {
  describe('unregister - Correct use cases\n  Unregister:', () => {
    describe('Returns correctly when called', () => {
      test('with one action message that is registered', () => {
        const unregisterMock = unregister([{ message: 'a', func: () => 'a' }])
        const expected = 0
        const actual = unregisterMock('a')
        expect(actual).toBe(expected)
      })

      test('with more than one action message, being all registered', () => {
        const unregisterMock = unregister([
          { message: 'a', func: () => 'a' },
          { message: 'b', func: () => 'b' }
        ])
        const expected = 0
        const actual = unregisterMock(['a', 'b'])
        expect(actual).toBe(expected)
      })
    })

    describe('Update [actions] correctly when called', () => {
      test('with one action message that is registered', () => {
        const actions = [{ message: 'a', func: () => 'a' }]
        const unregisterMock = unregister(actions)
        const expected = stringify([])
        unregisterMock('a')
        expect(stringify(actions)).toBe(expected)
      })
      test('with more than one action message, being all registered', () => {
        const actions = [
          { message: 'a', func: () => 'a' },
          { message: 'b', func: () => 'a' }
        ]
        const unregisterMock = unregister(actions)
        const expected = stringify([])
        unregisterMock(['a', 'b'])
        expect(stringify(actions)).toBe(expected)
      })
    })
  })
}
