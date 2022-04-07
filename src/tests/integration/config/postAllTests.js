/* global WorkerWrapper */

const JSONreplacer = (key, value) => {
  if (value instanceof Function) return value.toString()
  if (value === undefined) return 'undefined'
  return value
}

const stringify = (msg, replacer = JSONreplacer) => JSON.stringify(msg, replacer)

const postAllTests = {
  worker: WorkerWrapper.create([
    { message: 'a', func: () => 'a' },
    { message: 'b', func: () => 'b' },
    { message: 'c', func: arg => arg },
    {
      message: 'd',
      func: function () {
        const arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default'
        return arg1
      }
    }
  ]),
  t1 () {
    return this.worker.postAll()
      .then(result => {
        resultEl.innerHTML = stringify(result.map(r => r.data))
        return result.map(r => r.data)
      })
      .catch(err => err)
  },
  t2 () {
    return this.worker.postAll(['a'])
      .then(result => {
        resultEl.innerHTML = stringify(result.map(r => r.data))
        return result.map(r => r.data)
      })
      .catch(err => err)
  },
  t3 () {
    return this.worker.postAll(['a', 'b'])
      .then(result => {
        resultEl.innerHTML = stringify(result.map(r => r.data))
        return result.map(r => r.data)
      })
      .catch(err => err)
  },
  t4 () {
    return this.worker.postAll([{ message: 'a', args: [] }])
      .then(result => {
        resultEl.innerHTML = stringify(result.map(r => r.data))
        return result.map(r => r.data)
      })
      .catch(err => err)
  },
  t5 () {
    return this.worker.postAll([
      { message: 'a', args: [] },
      { message: 'b', args: [] }
    ])
      .then(result => {
        resultEl.innerHTML = stringify(result.map(r => r.data))
        return result.map(r => r.data)
      })
      .catch(err => err)
  },
  t6 () {
    return this.worker.postAll([[null], [null], [null], [null]])
      .then(result => {
        console.log(result)
        resultEl.innerHTML = stringify(result.map(r => r.data))
        return result.map(r => r.data)
      })
      .catch(err => err)
  },
  t7 () {
    return this.worker.postAll([[], ['ignored', 'args'], ['something'], ['overwrited']])
      .then(result => {
        resultEl.innerHTML = stringify(result.map(r => r.data))
        return result.map(r => r.data)
      })
      .catch(err => err)
  },
  t8 () {
    return this.worker.postAll([[], ['ignored', 'args'], ['something'], []])
      .then(result => {
        resultEl.innerHTML = stringify(result.map(r => r.data))
        return result.map(r => r.data)
      })
      .catch(err => err)
  }
}
