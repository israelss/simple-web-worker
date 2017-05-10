import { _post } from './_post'
import { _postAll } from './_postAll'
import { _register } from './_register'
import { _unregister } from './_unregister'

const _createReusableWorker = actions => {
  return {
    actions: actions,
    postMessage: _post(actions),
    postAll: _postAll,
    register: _register(actions),
    unregister: _unregister(actions)
  }
}

export { _createReusableWorker }
