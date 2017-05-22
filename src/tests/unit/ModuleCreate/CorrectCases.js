/* global describe, test, expect */

export default (create) => {
  describe('create - Correct use cases.\n  Create:', () => {
    describe('Returns an object when the argument is', () => {
      test('unexistent or undefined', () => expect(create()).toBeInstanceOf(Object))
      test('an array of actions', () => expect(create([{message: 'func1', func: () => 'Work 1'}])).toBeInstanceOf(Object))
    })
    describe('Has all properties when the argument is', () => {
      describe('unexistent or undefined:', () => {
        const actual = create()
        describe('Property actions', () => {
          test('exists', () => expect(actual).toHaveProperty('actions'))
          test('is an array', () => expect(actual.actions).toBeInstanceOf(Array))
          test('has length === 0', () => expect(actual.actions.length).toBe(0))
        })

        describe('Property postMessage', () => {
          test('exists', () => expect(actual).toHaveProperty('postMessage'))
          test('is a function', () => expect(actual.postMessage).toBeInstanceOf(Function))
        })

        describe('Property postAll', () => {
          test('exists', () => expect(actual).toHaveProperty('postAll'))
          test('is a function', () => expect(actual.postAll).toBeInstanceOf(Function))
        })

        describe('Property register', () => {
          test('exists', () => expect(actual).toHaveProperty('register'))
          test('is a function', () => expect(actual.register).toBeInstanceOf(Function))
        })

        describe('Property unregister', () => {
          test('exists', () => expect(actual).toHaveProperty('unregister'))
          test('is a function', () => expect(actual.unregister).toBeInstanceOf(Function))
        })
      })

      describe('an array of actions', () => {
        const actual = create([{message: 'func1', func: () => 'Work 1'}])
        describe('Property actions', () => {
          test('exists', () => expect(actual).toHaveProperty('actions'))
          test('is an array', () => expect(actual.actions).toBeInstanceOf(Array))
          test('has length === 0', () => expect(actual.actions.length).toBe(1))
        })

        describe('Property postMessage', () => {
          test('exists', () => expect(actual).toHaveProperty('postMessage'))
          test('is a function', () => expect(actual.postMessage).toBeInstanceOf(Function))
        })

        describe('Property postAll', () => {
          test('exists', () => expect(actual).toHaveProperty('postAll'))
          test('is a function', () => expect(actual.postAll).toBeInstanceOf(Function))
        })

        describe('Property register', () => {
          test('exists', () => expect(actual).toHaveProperty('register'))
          test('is a function', () => expect(actual.register).toBeInstanceOf(Function))
        })

        describe('Property unregister', () => {
          test('exists', () => expect(actual).toHaveProperty('unregister'))
          test('is a function', () => expect(actual.unregister).toBeInstanceOf(Function))
        })
      })
    })
  })
}
