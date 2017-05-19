export const createDisposableWorker = response => {
  const URL = window.URL || window.webkitURL
  const blob = new Blob([response], { type: 'application/javascript' }) // eslint-disable-line
  const worker = new Worker(URL.createObjectURL(blob)) // eslint-disable-line
  worker.post = message =>
    new Promise((resolve, reject) => {
      worker.onmessage = event => resolve(event.data)
      worker.onerror = e => {
        console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`)
        reject(e)
      }
      worker.postMessage({ message })
    })
  return worker
}
