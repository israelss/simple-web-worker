import { test, describe, expect } from '@jest/globals'

export default (builders) => {
  describe('Builders - Correct use cases.', () => {
    describe('makeAsyncResponse', () => {
      describe('without async', () => {
        test('with an arrow function', () => {
          const actual = JSON.parse(JSON.stringify(builders.makeAsyncResponse(() => Promise.resolve('a'))))
          const expected = `
self.onmessage = async function(event) {
  if(event.data.message === '__CLOSE_WORKER__'){
    return close()
  }

  const args = event.data.message.args

  if (args) {
    const msg = await (() => Promise.resolve('a')).apply(null, args)
    self.postMessage(msg)
  }
  const msg = await (() => Promise.resolve('a'))()
  self.postMessage(msg)
}
`
          expect(actual).toBe(expected)
        })
        test('with a function expression', () => {
          const actual = JSON.parse(JSON.stringify(builders.makeAsyncResponse(function a () { return Promise.resolve('a') })))
          const expected = `
self.onmessage = async function(event) {
  if(event.data.message === '__CLOSE_WORKER__'){
    return close()
  }

  const args = event.data.message.args

  if (args) {
    const msg = await (function a() {
            return Promise.resolve('a');
          }).apply(null, args)
    self.postMessage(msg)
  }
  const msg = await (function a() {
            return Promise.resolve('a');
          })()
  self.postMessage(msg)
}
`
          expect(actual).toBe(expected)
        })
      })
      describe('with async', () => {
        test('with an arrow function', () => {
          const actual = JSON.parse(JSON.stringify(builders.makeAsyncResponse(async () => 'a')))
          const expected = `
self.onmessage = async function(event) {
  if(event.data.message === '__CLOSE_WORKER__'){
    return close()
  }

  const args = event.data.message.args

  if (args) {
    const msg = await (async () => 'a').apply(null, args)
    self.postMessage(msg)
  }
  const msg = await (async () => 'a')()
  self.postMessage(msg)
}
`
          expect(actual).toBe(expected)
        })
        test('with a function expression', () => {
          const actual = JSON.parse(JSON.stringify(builders.makeAsyncResponse(async function a () { return 'a' })))
          const expected = `
self.onmessage = async function(event) {
  if(event.data.message === '__CLOSE_WORKER__'){
    return close()
  }

  const args = event.data.message.args

  if (args) {
    const msg = await (async function a() {
            return 'a';
          }).apply(null, args)
    self.postMessage(msg)
  }
  const msg = await (async function a() {
            return 'a';
          })()
  self.postMessage(msg)
}
`
          expect(actual).toBe(expected)
        })
      })
    })

    describe('makeResponse', () => {
      test('with an arrow function', () => {
        const actual = JSON.parse(JSON.stringify(builders.makeResponse(() => 'a')))
        const expected = `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      self.postMessage((() => 'a').apply(null, args))
      return close()
    }
    self.postMessage((() => 'a')())
    return close()
  }
`
        expect(actual).toBe(expected)
      })

      test('with a function expression', () => {
        const actual = builders.makeResponse(function a () { return 'a' })
        const expected = `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      self.postMessage((function a() {
          return 'a';
        }).apply(null, args))
      return close()
    }
    self.postMessage((function a() {
          return 'a';
        })())
    return close()
  }
`
        expect(actual).toBe(expected)
      })
    })

    describe('argumentError', () => {
      describe('pass try', () => {
        test('Passing expected, received and extraInfo', () => {
          const options = {
            expected: 'expected',
            received: 'received',
            extraInfo: 'extraInfo'
          }
          const actual = builders.argumentError(options)
          const expected = new TypeError('You should provide expected\nextraInfo\nReceived: "received"')
          expect(actual).toEqual(expected)
        })

        test('Passing expected and received', () => {
          const options = {
            expected: 'expected',
            received: 'received'
          }
          const actual = builders.argumentError(options)
          const expected = new TypeError('You should provide expected\n\nReceived: "received"')
          expect(actual).toEqual(expected)
        })

        test('Passing expected and extraInfo', () => {
          const options = {
            expected: 'expected',
            extraInfo: 'extraInfo'
          }
          const actual = builders.argumentError(options)
          const expected = new TypeError('You should provide expected\nextraInfo\nReceived: undefined')
          expect(actual).toEqual(expected)
        })

        test('Passing received and extraInfo', () => {
          const options = {
            received: 'received',
            extraInfo: 'extraInfo'
          }
          const actual = builders.argumentError(options)
          const expected = new TypeError('You should provide \nextraInfo\nReceived: "received"')
          expect(actual).toEqual(expected)
        })
      })

      test('fail try with circular structure', () => {
        const options = {
          expected: 'expected',
          received: null,
          extraInfo: 'extraInfo'
        }
        options.received = options
        const actual = builders.argumentError(options)
        const expected = new TypeError('You should provide expected\nextraInfo\nReceived a circular structure: [object Object]')
        expect(actual).toEqual(expected)
      })
    })
  })
}
