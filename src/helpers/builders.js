import { CLOSE_WORKER, wrongArgs, wrongArgsCircular } from './messages'

// Argument error builder
const argumentError = ({ expected = '', received, extraInfo = '' }) => {
  try {
    return new TypeError(wrongArgs(expected, received, extraInfo))
  } catch (err) {
    if (err.message.includes('Converting circular structure to JSON')) {
      return new TypeError(wrongArgsCircular(expected, received, extraInfo))
    }
    throw err
  }
}

// Response builder
const makeResponse = work => `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      self.postMessage((${work}).apply(null, args))
      return close()
    }
    self.postMessage((${work})())
    return close()
  }
`

// Async response builder
const makeAsyncResponse = work => `
self.onmessage = async function(event) {
  if(event.data.message === '${CLOSE_WORKER}'){
    return close()
  }

  const args = event.data.message.args

  if (args) {
    const msg = await (${work}).apply(null, args)
    self.postMessage(msg)
  }
  const msg = await (${work})()
  self.postMessage(msg)
}
`

export {
  argumentError,
  makeResponse,
  makeAsyncResponse
}
