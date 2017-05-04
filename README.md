# SimpleWebWorker
> An utility to simplify the use of web workers

DISCLAIMER: This plugin is in beta stage, and is not production ready!

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

> Where _func_ is the function to be runned in worker.

E.g.:
```javascript
// run() works like Promise.resolve(), but in another thread
SWorker.run(() => 'Function in other thread')
  .then(console.log) // logs 'Function in other thread'
```
This method creates a disposable web worker, runs and returns the result of given function and closes the worker.

### SWorker.create(_[actions]_)

> Where `[actions]` is an array of objects with two fields, `message` and `func`. Essentially, it is a messages-actions map.

E.g.:
```javascript
const actions = [
  { message: 'func1', func: () => 'Working on func1'},
  { message: 'func2', func: () => 'Working on func2'},
  { message: 'func3', func: () => 'Working on func3'}
]

let worker = SWorker.create(actions)
```
If you plan to reuse a worker, you should use the `create` method.

It creates a reusable worker (not a real Web Worker, more on this ahead) with determined actions to be runned through its `postMessage()` or `postAll()` methods.

### <worker\>.postMessage(_message_)

> Where <worker\> is a worker created with `SWorker.create([actions])`, and _message_ is one of the messages in _[actions]_.

E.g.:
```javascript
const actions = [
  { message: 'func1', func: () => 'Working on func1'},
  { message: 'func2', func: () => 'Working on func2'},
  { message: 'func3', func: () => 'Working on func3'}
]

let worker = SWorker.create(actions)

// postMessage() works like Promise.resolve(), but in another thread
worker.postMessage('func1')
  .then(console.log) // logs 'Working on func1'

worker.postMessage('func2')
  .then(console.log) // logs 'Working on func2'

worker.postMessage('func3')
  .then(console.log) // logs 'Working on func3'
```
### <worker\>.postAll(_[messages]_)

> Where <worker\> is a worker created with `SWorker.create([actions])`, and _messages_ is an array containing one or more of the messages in _[actions]_.

E.g.:
```javascript
const actions = [
  { message: 'func1', func: () => 'Working on func1'},
  { message: 'func2', func: () => 'Working on func2'},
  { message: 'func3', func: () => 'Working on func3'}
]

let worker = SWorker.create(actions)

// postAll() works like Promise.all(), but in another thread
worker.postAll(['func1', 'func2', 'func3'])
  .then(console.log) // logs ['func1', 'func2', 'func3']
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