/* global describe, test, expect */

export default (post, actions, externalModule) => {
  describe('post - Correct use cases.\n  Post:', () => {
    describe('Returns correctly', () => {
      describe('without args when', () => {
        test('does not expect args', () => {
          expect.assertions(1)
          return expect(post('func1')).resolves.toBe('Worker 1: Working on func1')
        })

        test('does expect args', () => {
          expect.assertions(1)
          return expect(post('func2')).resolves.toBe('Worker 2: undefined')
        })

        test('have default args', () => {
          expect.assertions(1)
          return expect(post('func4')).resolves.toBe('Worker 4: Working on func4')
        })
      })

      describe('with args when', () => {
        test('does not expect args', () => {
          expect.assertions(1)
          return expect(post('func1', ['Ignored', 'arguments'])).resolves.toBe('Worker 1: Working on func1')
        })

        test('does expect args', () => {
          expect.assertions(1)
          return expect(post('func3', ['Working on func3'])).resolves.toBe('Worker 3: Working on func3')
        })

        test('have default args', () => {
          expect.assertions(1)
          return expect(post('func4', ['Overwrited argument'])).resolves.toBe('Worker 4: Overwrited argument')
        })
      })
    })

    describe('Calls `run` once', () => {
      describe('without args when', () => {
        test('not expecting args', () => {
          post('func1')
          return expect(externalModule.run).toHaveBeenCalledTimes(1)
        })

        test('expecting args', () => {
          post('func2')
          return expect(externalModule.run).toHaveBeenCalledTimes(1)
        })

        test('have default args', () => {
          post('func4')
          expect(externalModule.run).toHaveBeenCalledTimes(1)
        })
      })

      describe('with args when', () => {
        test('does not expect args', () => {
          post('func1', ['Ignored', 'arguments'])
          return expect(externalModule.run).toHaveBeenCalledTimes(1)
        })

        test('does expect args', () => {
          post('func3', ['Working on func3'])
          return expect(externalModule.run).toHaveBeenCalledTimes(1)
        })

        test('have default args', () => {
          post('func4', ['Overwrited argument'])
          expect(externalModule.run).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
}
