# SimpleWebWorker
> An utility to simplify the use of web workers

## Changelog

### **1.0.0**

#### _Highlights:_
* First stable release.
* Included methods `register` and `unregister`.
* Improved method `postAll`.

See full changelog [here](https://github.com/israelss/simple-web-worker/changelog.md).

## Why

Create and use [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) can be cumbersome sometimes. This plugin aims to facilitate the use of Web Workers.

## How to install and use

```
yarn add simple-web-worker

// or

npm install simple-web-worker --save
```

Then:

```javascript
import SWorker from 'simple-web-worker'
```
Obviously, you don't have to call it `SWorker`. You are free to use the name you want!

## API

### SWorker.run(_func_)

> Where:
<br>* _func_ is the function to be runned in worker

E.g.:
```javascript
// run() works like Promise.resolve(), but in another thread
SWorker.run(() => 'Function in other thread')
  .then(console.log) // logs 'Function in other thread'
  .catch(console.error) // logs any possible error
```
This method creates a disposable web worker, runs and returns the result of given function and closes the worker.

### SWorker.create(_[actions]?_)

> Where:
<br>* `[actions]` is an optional array of objects with two fields, `message` and `func`. Essentially, it is a messages-actions map.
<br><br>If _[actions]_ is omitted or `undefined`, the created <worker\> will have no registered actions, so you'll have to use the method `register` before you can use the worker.

E.g.:
```javascript
const actions = [
  { message: 'func1', func: () => 'Working on func1' },
  { message: 'func2', func: () => 'Working on func2' },
  { message: 'func3', func: () => 'Working on func3' }
]

let worker = SWorker.create(actions)
```
If you plan to reuse a worker, you should use the `create` method.

It creates a reusable worker (not a real Web Worker, more on this ahead) with determined actions to be runned through its `postMessage()` or `postAll()` methods.

### <worker\>.postMessage(_message_)

> Where:
<br>* <worker\> is a worker created with `SWorker.create([actions])`
<br>* _message_ is one of the messages in _[actions]_

E.g.:
```javascript
const actions = [
  { message: 'func1', func: () => 'Working on func1' },
  { message: 'func2', func: () => 'Working on func2' },
  { message: 'func3', func: () => 'Working on func3' }
]

let worker = SWorker.create(actions)

// postMessage() works like Promise.resolve(), but in another thread
worker.postMessage('func1')
  .then(console.log) // logs 'Working on func1'
  .catch(console.error) // logs any possible error

worker.postMessage('func2')
  .then(console.log) // logs 'Working on func2'
  .catch(console.error) // logs any possible error

worker.postMessage('func3')
  .then(console.log) // logs 'Working on func3'
  .catch(console.error) // logs any possible error
```
### <worker\>.postAll(_[messages]?_)

> Where:
<br>* **<worker\>** is a worker created with `SWorker.create([actions])`
<br>* _[messages]_ is an optional array containing one or more of the messages in _[actions]_
<br><br>If _[messages]_ is omitted or `undefined`, **<worker\>** will run all registered actions.

E.g.:
```javascript
const actions = [
  { message: 'func1', func: () => 'Working on func1' },
  { message: 'func2', func: () => 'Working on func2' },
  { message: 'func3', func: () => 'Working on func3' },
  { message: 'func4', func: () => 'Working on func4' }
]

let worker = SWorker.create(actions)

// postAll() works like Promise.all(), but in another thread

// With argument
worker.postAll(['func1', 'func3'])
  .then(console.log) // logs ['Working on func1', 'Working on func3']
  .catch(console.error) // logs any possible error

// Without argument
worker.postAll()
  .then(console.log) // logs ['Working on func1', 'Working on func2', 'Working on func3', 'Working on func4']
  .catch(console.error) // logs any possible error
```

### <worker\>.register(_action_ || _[actions]_)

> Where:
<br>* **<worker\>** is a worker created with `SWorker.create([actions])`
<br>* _action_ is an object with two fields, `message` and `func`
<br>* _[actions]_ is an array of objects, and each object is an _action_, as defined above
<br><br>You can use _action_ or _[actions]_, but not both at the same time.

E.g.:

```javascript
const initialActions = [
  { message: 'func1', func: () => 'Working on func1' }
]

let worker = SWorker.create(initialActions)

worker.postAll()
  .then(console.log) // logs ['Working on func1']
  .catch(console.error) // logs any possible error

// registering just one action
worker.register({ message: 'func2', func: () => 'Working on func2' })

worker.postAll()
  .then(console.log) // logs ['Working on func1', 'Working on func2']
  .catch(console.error) // logs any possible error

// registering multiple actions
worker.register([
  { message: 'func3', func: () => 'Working on func3' },
  { message: 'func4', func: () => 'Working on func4' }
])

worker.postAll()
  .then(console.log) // logs ['Working on func1', 'Working on func2', 'Working on func3', 'Working on func4']
  .catch(console.error) // logs any possible error
```

### <worker\>.unregister(_message_ || _[messages]_)

> Where:
<br>* **<worker\>** is a worker created with `SWorker.create([actions])`
<br>* _message_ is one of the messages in _[actions]_
<br>* _[messages]_ is an array containing one or more messages, and each message is a _message_, as defined above
<br><br>You can use _message_ or _[messages]_, but not both at the same time.

E.g.:

```javascript
const initialActions = [
  { message: 'func1', func: () => 'Working on func1'},
  { message: 'func2', func: () => 'Working on func2'},
  { message: 'func3', func: () => 'Working on func3'},
  { message: 'func4', func: () => 'Working on func4'}
]

let worker = SWorker.create(initialActions)

worker.postAll()
  .then(console.log) // logs ['Working on func1', 'Working on func2', 'Working on func3', 'Working on func4']
  .catch(console.error) // logs any possible error

// unregistering just one action
worker.unregister('func2')

worker.postAll()
  .then(console.log) // logs ['Working on func1', 'Working on func3', 'Working on func4']
  .catch(console.error) // logs any possible error

// unregistering multiple actions
worker.unregister(['func3', 'func1'])

worker.postAll()
  .then(console.log) // logs ['Working on func4']
  .catch(console.error) // logs any possible error
```

## Closing workers?

You may be thinking: "How do I terminate those reusable workers if there's no `close()` or `terminate()` methods?"

Well, when you create a reusable worker, you don't receive a real Web Worker.

Instead, you get an object which holds the given messages-actions map, and when you call `postMessage()` or `postAll()` it will, under the hood, call `run()` with the correspondent functions.

So, to "terminate" a "worker" when it is not needed anymore, you can just do:

```javascript
let worker = SWorker.create(actions)

// use the worker

worker = null
```