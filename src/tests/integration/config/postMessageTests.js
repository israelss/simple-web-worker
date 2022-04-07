/* global WorkerWrapper */

const postMessageTests = {
  t1 () {
    const worker = WorkerWrapper.create([{ message: 'a', func: () => 'a' }])
    return worker.postMessage('a')
      .then(result => {
        resultEl.innerHTML = result.data
        return result.data
      })
      .catch(err => err)
  },

  t2 () {
    const worker = WorkerWrapper.create([{ message: 'a', func: (arg) => `${arg}` }])
    return worker.postMessage('a')
      .then(result => {
        resultEl.innerHTML = result.data
        return result.data
      })
      .catch(err => err)
  },

  t3 () {
    const worker = WorkerWrapper.create([{
      message: 'a',
      func: function (arg) {
        return arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value'
      }
    }])
    return worker.postMessage('a')
      .then(result => {
        resultEl.innerHTML = result.data
        return result.data
      })
      .catch(err => err)
  },

  t4 () {
    const worker = WorkerWrapper.create([{ message: 'a', func: () => 'a' }])
    return worker.postMessage('a', ['Ignored', 'arguments'])
      .then(result => {
        resultEl.innerHTML = result.data
        return result.data
      })
      .catch(err => err)
  },

  t5 () {
    const worker = WorkerWrapper.create([{ message: 'a', func: (arg) => `${arg}` }])
    return worker.postMessage('a', ['a'])
      .then(result => {
        resultEl.innerHTML = result.data
        return result.data
      })
      .catch(err => err)
  },

  t6 () {
    const worker = WorkerWrapper.create([{
      message: 'a',
      func: function (arg) {
        return arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value'
      }
    }])
    return worker.postMessage('a', ['a'])
      .then(result => {
        resultEl.innerHTML = result.data
        return result.data
      })
      .catch(err => err)
  },

  t7 () {
    const worker = WorkerWrapper.create([{ message: 'a', func: () => 'a' }])
    return worker.postMessage('Darth Vader')
      .then(result => {
        resultEl.innerHTML = result.data
        return result.data
      })
      .catch(err => err)
  }
}

const asyncPostMessageTests = {
  t1 () {
    const worker = WorkerWrapper.create([{
      message: 'a',
      func: async (args) => {
        setInterval(() => {
          console.log('hello async func')
        }, 1000)
        const p = new Promise((resolve) => {
          setTimeout(() => {
            resolve(args)
          }, 3000)
        })
        return await p
      }
    }])
    return worker.postMessage('a', ['async func'])
      .then(result => {
        resultEl.innerHTML = result.data
        setTimeout(() => {
          console.log('work1 closed')
          result.close()
        }, 5000)
      })
      .catch(err => err)
  }
}
