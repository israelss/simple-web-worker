'use strict';

// Argument validation
const isValidObjectWith = fields => obj => !!obj && !Array.isArray(obj) && fields.every(field => obj.hasOwnProperty(field));

const isValidAction = obj => {
  return isValidObjectWith(['message', 'func'])(obj) && typeof obj.func === 'function' && typeof obj.message === 'string';
};

const isValidActionsArray = arr => arr.every(isValidAction);

const isValidPostParams = obj => {
  return isValidObjectWith(['message', 'args'])(obj) && Array.isArray(obj.args) && typeof obj.message === 'string';
};

const isValidPostParamsArray = arr => arr.every(isValidPostParams);

const isValidObjectsArray = arr => (fields = []) => arr.every(isValidObjectWith(fields));

const testArray = {
  'actionsArray': arr => isValidActionsArray(arr),
  'arraysArray': arr => arr.every(item => Array.isArray(item)),
  'objectsArray': arr => isValidObjectsArray(arr)(),
  'postParamsArray': arr => isValidPostParamsArray(arr),
  'stringsArray': arr => arr.every(item => typeof item === 'string')
};

const isValidArg = arg => type => {
  if (type === 'null') return arg === null;
  if (type === 'undefined') return arg === undefined;
  if (type === 'action') return isValidAction(arg);
  if (Array.isArray(arg)) {
    if (type !== 'array' && !testArray[type]) return false;
    if (type === 'array') return true;
    return testArray[type](arg);
  }
  if (arg) return typeof arg === type.toString(); // eslint-disable-line
  return false;
};

const isValid = argument => (types = null) => {
  if (Array.isArray(types)) return types.some(type => isValidArg(argument)(type));
  if (isValidArg(argument)(types)) return true;
  return false;
};

// Argument error builder
const argumentError = ({ expected = '', received, extraInfo = '' }) => {
  try {
    return new TypeError(`${'You should provide ' + expected}${'\n' + extraInfo}${'\nReceived: ' + JSON.stringify(received)}`);
  } catch (err) {
    if (err.message === 'Converting circular structure to JSON') {
      return new TypeError(`${'You should provide ' + expected}${'\n' + extraInfo}${'\nReceived a circular structure: ' + received}`);
    }
    throw err;
  }
};

// Response builder
const makeResponse = work => `
  self.onmessage = event => {
    const args = event.data.message.args
    if (args) {
      return Promise.resolve((${work}).apply(null, args))
        .then(result => { self.postMessage(result) })
        .then(() => close())
        .catch(err => setTimeout(() => { throw err; }))
    }
    return Promise
      .resolve((${work})())
      .then(result => { self.postMessage(result) })
      .then(() => close())
      .catch(err => setTimeout(() => { throw err; }))
  }
`;

const createDisposableWorker = response => {
  const URL = window.URL || window.webkitURL;
  const blob = new Blob([response], { type: 'application/javascript' }); // eslint-disable-line
  const objectURL = URL.createObjectURL(blob);
  const worker = new Worker(objectURL); // eslint-disable-line
  worker.post = message => new Promise((resolve, reject) => {
    worker.onmessage = event => {
      URL.revokeObjectURL(objectURL);
      resolve(event.data);
    };
    worker.onerror = e => {
      console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`);
      reject(e);
    };
    worker.postMessage({ message });
  });
  return worker;
};

const run = (work = null, args) => {
  const validWork = isValid(work)('function');
  const validArgs = isValid(args)(['array', 'undefined']);
  if (validWork && validArgs) {
    const worker = createDisposableWorker(makeResponse(work));
    return worker.post({ args });
  }
  if (!validWork) console.error(argumentError({ expected: 'a function', received: work }));
  if (!validArgs) console.error(argumentError({ expected: 'an array', received: args }));
  return null;
};

const warnWork = msg => {
  console.warn(`WARN! ${msg} is not a registered action for this worker`);
  return `${msg} is not a registered action for this worker`;
};

const post = actions => (msg = null, args) => {
  const validMessage = isValid(msg)('string');
  const validArgs = isValid(args)(['array', 'undefined']);
  if (validMessage && validArgs) {
    const work = actions.filter(({ message }) => JSON.stringify(message) === JSON.stringify(msg)).map(action => action.func).pop();

    if (!work) return run(warnWork, [JSON.stringify(msg)]);
    if (args) return run(work, args);
    return run(work);
  }

  if (!validMessage) console.error(argumentError({ expected: 'a string', received: msg }));
  if (!validArgs) console.error(argumentError({ expected: 'an array', received: args }));
  return null;
};

// import { invalidObjectsArray, isArrayOf, notArray, returnNull, wrongLength, wrongObjects } from './utils'
const makeOptionsFor = arr => {
  return {
    expected: 'an array of arrays, an array of objects, or an array of strings',
    received: arr,
    extraInfo: 'If an array of arrays, ' + 'it must have the same length as the actions registered for this worker.\n' + 'If an array of objects, every object must containing two fields:\n* message\n* args'
  };
};
function postAll(arr = []) {
  if (isValid(arr)(['arraysArray', 'postParamsArray', 'stringsArray'])) {
    if (arr.length === 0) return Promise.all(this.actions.map(({ message }) => this.postMessage(message)));

    if (arr.every(item => typeof item === 'string')) {
      return Promise.all(arr.map(msg => this.postMessage(msg)));
    }

    if (arr.every(item => typeof item === 'object' && !Array.isArray(item))) {
      return Promise.all(arr.map(({ message, args }) => this.postMessage(message, args)));
    }

    if (arr.every(item => Array.isArray(item)) && arr.length === this.actions.length) {
      return Promise.all(arr.map((args, index) => this.postMessage(this.actions[index].message, args)));
    }
  }

  console.error(argumentError(makeOptionsFor(arr)));
  return null;
}

const isActionOf = actions => newAction => actions.some(action => action.message === newAction.message);

const warnMsg = action => `WARN! An action with message "${action.message}" is already registered for this worker`;

const pushInto = actions => action => {
  if (isActionOf(actions)(action)) {
    console.warn(warnMsg(action));
    return actions.length;
  }
  return actions.push(action);
};

const makeOptionsFor$1 = action => {
  return {
    expected: 'an array of actions or an action',
    received: action,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  };
};

const register = actions => (action = null) => {
  if (isValid(action)(['action', 'actionsArray'])) {
    if (Array.isArray(action)) {
      return action.reduce((actions, action) => {
        pushInto(actions)(action);
        return actions;
      }, actions).length;
    }

    return pushInto(actions)(action);
  }
  console.error(argumentError(makeOptionsFor$1(action)));
  return null;
};

const removeFrom = actions => msg => {
  const index = actions.findIndex(({ message }) => message === msg);
  index === -1 ? console.warn(`WARN! Impossible to unregister action with message "${msg}".\nIt is not a registered action for this worker.`) : actions.splice(index, 1);
  return actions;
};

const makeOptions = msg => {
  return {
    expected: 'an array of strings or a string',
    received: msg
  };
};

const unregister = actions => (msg = null) => {
  if (isValid(msg)(['string', 'stringsArray'])) {
    if (Array.isArray(msg)) {
      return msg.reduce((actions, message) => {
        removeFrom(actions)(message);
        return actions;
      }, actions).length;
    }
    return removeFrom(actions)(msg).length;
  }

  console.error(argumentError(makeOptions(msg)));
  return null;
};

const options = actions => {
  return {
    expected: 'an array of objects',
    received: actions,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  };
};

const create = (actions = []) => {
  if (isValid(actions)('actionsArray')) {
    return {
      actions: actions,
      postMessage: post(actions),
      postAll: postAll,
      register: register(actions),
      unregister: unregister(actions)
    };
  }
  console.error(argumentError(options(actions)));
  return null;
};

const createWrapper = () => {
  if (!window.Worker) {
    console.error('This browser does not support Workers.');
    return null;
  }
  if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
    console.error('This browser does not have URL.createObjectURL method.');
    return null;
  }
  return { create, run };
};

const WorkerWrapper = createWrapper();
