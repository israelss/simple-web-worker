/* global WorkerWrapper */

const JSONreplacer = (key, value) => {
  if (value instanceof Function) return value.toString()
  if (value === undefined) return 'undefined'
  return value
}

const stringify = (msg, replacer = JSONreplacer) => JSON.stringify(msg, replacer)

const resultEl = document.querySelector('#result')

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
        resultEl.innerHTML = stringify(result)
        return result
      })
      .catch(err => err)
  },
  t2 () {
    return this.worker.postAll(['a'])
      .then(result => {
        resultEl.innerHTML = stringify(result)
        return result
      })
      .catch(err => err)
  },
  t3 () {
    return this.worker.postAll(['a', 'b'])
      .then(result => {
        resultEl.innerHTML = stringify(result)
        return result
      })
      .catch(err => err)
  },
  t4 () {
    return this.worker.postAll([{ message: 'a', args: [] }])
      .then(result => {
        resultEl.innerHTML = stringify(result)
        return result
      })
      .catch(err => err)
  },
  t5 () {
    return this.worker.postAll([
      { message: 'a', args: [] },
      { message: 'b', args: [] }
    ])
      .then(result => {
        resultEl.innerHTML = stringify(result)
        return result
      })
      .catch(err => err)
  },
  t6 () {
    return this.worker.postAll([[null], [null], [null], [null]])
      .then(result => {
        console.log(result)
        resultEl.innerHTML = stringify(result)
        return result
      })
      .catch(err => err)
  },
  t7 () {
    return this.worker.postAll([[], ['ignored', 'args'], ['something'], ['overwrited']])
      .then(result => {
        resultEl.innerHTML = stringify(result)
        return result
      })
      .catch(err => err)
  },
  t8 () {
    return this.worker.postAll([[], ['ignored', 'args'], ['something'], []])
      .then(result => {
        resultEl.innerHTML = stringify(result)
        return result
      })
      .catch(err => err)
  }
}

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

const postMessageTests = {
  t1 () {
    const worker = WorkerWrapper.create([{message: 'a', func: () => 'a'}])
    return worker.postMessage('a')
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  t2 () {
    const worker = WorkerWrapper.create([{message: 'a', func: (arg) => `${arg}`}])
    return worker.postMessage('a')
      .then(result => {
        resultEl.innerHTML = result
        return result
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
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  t4 () {
    const worker = WorkerWrapper.create([{message: 'a', func: () => 'a'}])
    return worker.postMessage('a', ['Ignored', 'arguments'])
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  t5 () {
    const worker = WorkerWrapper.create([{message: 'a', func: (arg) => `${arg}`}])
    return worker.postMessage('a', ['a'])
      .then(result => {
        resultEl.innerHTML = result
        return result
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
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  t7 () {
    const worker = WorkerWrapper.create([{message: 'a', func: () => 'a'}])
    return worker.postMessage('Darth Vader')
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  }
}

const runTests = {
  // Run without args and without arrow function
  t1 () {
    return WorkerWrapper.run(function () { return 'Run without args and without arrow function' })
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without args and with arrow function
  t2 () {
    return WorkerWrapper.run(() => 'Run without args and with arrow function')
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run with args and without arrow function
  t3 () {
    return WorkerWrapper.run(function (arg1, arg2) { return `Run ${arg1} and ${arg2}` }, ['with args', 'without arrow function'])
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run with args and with arrow function
  t4 () {
    return WorkerWrapper.run((arg1, arg2) => `Run ${arg1} and ${arg2}`, ['with args', 'with arrow function'])
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without args but expecting them
  t5 () {
    return WorkerWrapper.run((arg1, arg2) => `Run ${arg1} and ${arg2}`)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without args but with default arg value
  t6 () {
    /** REASON FOR THAT UGLY FUNCTION (TIP: I CAN'T USE DEFAULT VALUES FOR ARGUMENTS IN THESE TESTS!):
      * I don't know why, but it is not possible to use default arguments in this test, like:
      *     (arg1 = 'default arg value') => `Run with ${arg1}`
      *
      * That returns a TypeError:
      *     An error occurred in ClientFunction code:
      *
      *     TypeError: se[u.type] is not a function
      *
      * So I just put in the LOOOONG TRANSPILED version of that, which is:
      *     function () {
      *       const arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value'
      *       return 'Run with ' + arg1
      *     }
      *
      * Even the slightly shorter version of that ugly function, i.e., an arrow function, can not be used:
      *     () => {
      *       const arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value'
      *       return 'Run with ' + arg1
      *     }
      * Returns an ReferenceError:
      *     ReferenceError: arguments is not defined
      * And an AssertionError (well, that's an error raised by the assertion test itself, so it's ok, I guess):
      *     AssertionError: expected { isTrusted: true } to be a string
      *
      * The bottom line is:
      *     I CAN'T USE DEFAULT VALUES FOR ARGUMENTS IN THESE TESTS!
      */
    return WorkerWrapper.run(function () {
      const arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value'
      return 'Run with ' + arg1
    }, undefined)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without args but without default
  t7 () {
    return WorkerWrapper.run((arg1) => `Run with ${arg1}`, undefined)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  }
}
