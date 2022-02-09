import { CLOSE_WORKER } from './utils';

export const createDisposableWorker = (response, isAsyncFunc = false) => {
  const URL = window.URL || window.webkitURL
  const blob = new Blob([response], { type: 'application/javascript' }) // eslint-disable-line
  const objectURL = URL.createObjectURL(blob)
  const worker = new Worker(objectURL) // eslint-disable-line
  worker.post = message =>
    new Promise((resolve, reject) => {
      worker.onmessage = event => {
        URL.revokeObjectURL(objectURL)
        if (isAsyncFunc) {
          resolve({ data: event.data, close: () => worker.postMessage({ message: CLOSE_WORKER }) })
        } else {
          resolve(event.data)
        }
      }
      worker.onerror = e => {
        console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`)
        reject(e)
      }
      worker.postMessage({ message })
    })
  return worker
}
