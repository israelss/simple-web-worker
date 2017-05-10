import { _create } from './_create'
import { _run } from './_run'

let WorkerWrapper = null

if (window.Worker) {
  WorkerWrapper = {
    create: _create,
    run: _run
  }
} else {
  console.warn('Your browser does not support Workers.')
}

export default WorkerWrapper
