export const createDisposableWorker = response => {
  const URL = window.URL || window.webkitURL
  const blob = new Blob([response], { type: 'application/javascript' }) // eslint-disable-line
  const objectURL = URL.createObjectURL(blob)
  const worker = new Worker(objectURL) // eslint-disable-line
  worker.post = message =>
    new Promise((resolve, reject) => {
      worker.onmessage = event => {
        URL.revokeObjectURL(objectURL)
        resolve(event.data)
      }
      worker.onerror = e => {
        console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`)
        reject(e)
      }
      const postMessageCloned = JSON.parse(JSON.stringify(message));
      worker.postMessage( {message:postMessageCloned} )
    })
  return worker
}
