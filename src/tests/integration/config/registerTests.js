/* global WorkerWrapper */

const registerTests = {
  t1 () {
    const worker = WorkerWrapper.create([])
    const result = worker.register({ message: 'a', func: () => 'a' })
    resultEl.innerHTML = result
    return result
  },

  t2 () {
    const worker = WorkerWrapper.create([])
    const result = worker.register([
      { message: 'a', func: () => 'a' },
      { message: 'b', func: () => 'b' }
    ])
    resultEl.innerHTML = result
    return result
  },

  t3 () {
    const worker = WorkerWrapper.create([{ message: 'a', func: () => 'a' }])
    const result = worker.register({ message: 'a', func: () => 'a' })
    resultEl.innerHTML = result
    return result
  },

  t4 () {
    const worker = WorkerWrapper.create([
      { message: 'a', func: () => 'a' },
      { message: 'b', func: () => 'b' }
    ])
    const result = worker.register([
      { message: 'a', func: () => 'a' },
      { message: 'b', func: () => 'b' }
    ])
    resultEl.innerHTML = result
    return result
  },

  t5 () {
    const worker = WorkerWrapper.create([
      { message: 'a', func: () => 'a' },
      { message: 'b', func: () => 'b' }
    ])
    const result = worker.register([
      { message: 'a', func: () => 'a' },
      { message: 'b', func: () => 'b' },
      { message: 'c', func: () => 'c' }
    ])
    resultEl.innerHTML = result
    return result
  }
}
