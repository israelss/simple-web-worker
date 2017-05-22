/* global describe, test, expect */

export default (worker) => {
  describe('postAll - Correct use cases.\n  PostAll:', () => {
    describe('Returns correctly when called', () => {
      test('without args and without message', () => {
        return expect(worker.postAll()).resolves.toEqual(['a', 'b', undefined, 'default'])
      })

      test('with one message (array of strings)', () => {
        return expect(worker.postAll(['a'])).resolves.toEqual(['a'])
      })

      test('with more than one message (array of strings)', () => {
        return expect(worker.postAll(['a', 'b'])).resolves.toEqual(['a', 'b'])
      })

      test('with one message (array of objects)', () => {
        return expect(worker.postAll([{ message: 'a', args: [] }])).resolves.toEqual(['a'])
      })

      test('with more than one message (array of objects)', () => {
        const messages = [
          { message: 'a', args: [] },
          { message: 'b', args: [] }
        ]
        return expect(worker.postAll(messages)).resolves.toEqual(['a', 'b'])
      })

      test('with an array of arrays (null in every array)', () => {
        return expect(worker.postAll([[null], [null], [null], [null]]))
          .resolves.toEqual(['a', 'b', null, null])
      })

      test('with an array of arrays (overwriting a default value)', () => {
        const messages = [
          [], ['ignored', 'args'], ['something'], ['overwrited']
        ]
        return expect(worker.postAll(messages))
          .resolves.toEqual(['a', 'b', 'something', 'overwrited'])
      })

      test('with an array of arrays (relying on a default value)', () => {
        const messages = [[], ['ignored', 'args'], ['something'], []]
        return expect(worker.postAll(messages))
          .resolves.toEqual(['a', 'b', 'something', 'default'])
      })
    })
  })
}
