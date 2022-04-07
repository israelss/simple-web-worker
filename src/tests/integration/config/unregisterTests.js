/* global WorkerWrapper */

const unregisterTests = {
  t1 () {
    const worker = WorkerWrapper.create([{ message: 'a', func: () => 'a' }])
    const result = worker.unregister('a')
    resultEl.innerHTML = result
    return result
  },

  t2 () {
    const worker = WorkerWrapper.create([
      { message: 'a', func: () => 'a' },
      { message: 'b', func: () => 'b' }
    ])
    const result = worker.unregister(['a', 'b'])
    resultEl.innerHTML = result
    return result
  },

  t3 () {
    const worker = WorkerWrapper.create([])
    const result = worker.unregister('a')
    resultEl.innerHTML = result
    return result
  },

  t4 () {
    const worker = WorkerWrapper.create([
      { message: 'c', func: () => 'c' },
      { message: 'd', func: () => 'd' }
    ])
    const result = worker.unregister(['a', 'b'])
    resultEl.innerHTML = result
    return result
  },

  t5 () {
    const worker = WorkerWrapper.create([
      { message: 'a', func: () => 'a' },
      { message: 'b', func: () => 'b' },
      { message: 'c', func: () => 'c' }
    ])
    const result = worker.unregister(['a', 'd', 'e'])
    resultEl.innerHTML = result
    return result
  }
}
