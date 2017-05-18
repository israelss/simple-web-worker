/* global WorkerWrapper */

// Run without args and without arrow function
export const test1 = () => {
  const resultEl = document.querySelector('#result')
  return WorkerWrapper.run(function () { return 'Run without args and without arrow function' })
    .then(result => {
      resultEl.innerHTML = result
      return result
    })
    .catch(err => err)
}

// Run without args and with arrow function
export const test2 = () => {
  const resultEl = document.querySelector('#result')
  return WorkerWrapper.run(() => 'Run without args and with arrow function')
    .then(result => {
      resultEl.innerHTML = result
      return result
    })
    .catch(err => err)
}

// Run with args and without arrow function
export const test3 = () => {
  const resultEl = document.querySelector('#result')
  return WorkerWrapper.run(function (arg1, arg2) { return `Run ${arg1} and ${arg2}` }, ['with args', 'without arrow function'])
    .then(result => {
      resultEl.innerHTML = result
      return result
    })
    .catch(err => err)
}

// Run with args and with arrow function
export const test4 = () => {
  const resultEl = document.querySelector('#result')
  return WorkerWrapper.run((arg1, arg2) => `Run ${arg1} and ${arg2}`, ['with args', 'with arrow function'])
    .then(result => {
      resultEl.innerHTML = result
      return result
    })
    .catch(err => err)
}

// Run without args but expecting them
export const test5 = () => {
  const resultEl = document.querySelector('#result')
  return WorkerWrapper.run((arg1, arg2) => `Run ${arg1} and ${arg2}`)
    .then(result => {
      resultEl.innerHTML = result
      return result
    })
    .catch(err => err)
}

// Run without args but with default arg value
export const test6 = () => {
  const resultEl = document.querySelector('#result')
  return WorkerWrapper.run((arg1 = 'default arg value') => `Run with ${arg1}`, undefined)
    .then(result => {
      resultEl.innerHTML = result
      return result
    })
    .catch(err => err)
}

// Run without args but without default
export const test7 = () => {
  const resultEl = document.querySelector('#result')
  return WorkerWrapper.run((arg1) => `Run with ${arg1}`, undefined)
    .then(result => {
      resultEl.innerHTML = result
      return result
    })
    .catch(err => err)
}
