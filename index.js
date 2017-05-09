import { _create } from './_create'
import { _run } from './_run'

let WorkerWrapper = null

if (window.Worker) {
  WorkerWrapper = {
    create: _create,
    run: _run
  }
}

export default WorkerWrapper
