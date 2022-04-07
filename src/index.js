import { create } from './create'
import { run } from './run'
import {
  CREATE_OBJECT_URL_NOT_FOUND,
  WORKER_NOT_SUPPORTED
} from './helpers/messages'

const createWrapper = () => {
  if (!window.Worker) {
    console.error(WORKER_NOT_SUPPORTED)
    return null
  }
  if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
    console.error(CREATE_OBJECT_URL_NOT_FOUND)
    return null
  }
  return { create, run }
}

const WorkerWrapper = createWrapper()

export default WorkerWrapper
