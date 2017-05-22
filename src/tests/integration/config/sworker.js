'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

// Argument validation
var isValidObjectWith = function isValidObjectWith(fields) {
  return function (obj) {
    return !!obj && !Array.isArray(obj) && fields.every(function (field) {
      return obj.hasOwnProperty(field);
    });
  };
};

var isValidAction = function isValidAction(obj) {
  return isValidObjectWith(['message', 'func'])(obj) && typeof obj.func === 'function' && typeof obj.message === 'string';
};

var isValidActionsArray = function isValidActionsArray(arr) {
  return arr.every(isValidAction);
};

var isValidPostParams = function isValidPostParams(obj) {
  return isValidObjectWith(['message', 'args'])(obj) && Array.isArray(obj.args) && typeof obj.message === 'string';
};

var isValidPostParamsArray = function isValidPostParamsArray(arr) {
  return arr.every(isValidPostParams);
};

var isValidObjectsArray = function isValidObjectsArray(arr) {
  return function () {
    var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return arr.every(isValidObjectWith(fields));
  };
};

var testArray = {
  'actionsArray': function actionsArray(arr) {
    return isValidActionsArray(arr);
  },
  'arraysArray': function arraysArray(arr) {
    return arr.every(function (item) {
      return Array.isArray(item);
    });
  },
  'objectsArray': function objectsArray(arr) {
    return isValidObjectsArray(arr)();
  },
  'postParamsArray': function postParamsArray(arr) {
    return isValidPostParamsArray(arr);
  },
  'stringsArray': function stringsArray(arr) {
    return arr.every(function (item) {
      return typeof item === 'string';
    });
  }
};

var isValidArg = function isValidArg(arg) {
  return function (type) {
    if (type === 'null') return arg === null;
    if (type === 'undefined') return arg === undefined;
    if (type === 'action') return isValidAction(arg);
    if (Array.isArray(arg)) {
      if (type !== 'array' && !testArray[type]) return false;
      if (type === 'array') return true;
      return testArray[type](arg);
    }
    if (arg) return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === type.toString(); // eslint-disable-line
    return false;
  };
};

var isValid = function isValid(argument) {
  return function () {
    var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (Array.isArray(types)) return types.some(function (type) {
      return isValidArg(argument)(type);
    });
    if (isValidArg(argument)(types)) return true;
    return false;
  };
};

// Argument error builder
var argumentError = function argumentError(_ref) {
  var _ref$expected = _ref.expected,
      expected = _ref$expected === undefined ? '' : _ref$expected,
      received = _ref.received,
      _ref$extraInfo = _ref.extraInfo,
      extraInfo = _ref$extraInfo === undefined ? '' : _ref$extraInfo;

  try {
    return new TypeError('' + ('You should provide ' + expected) + ('\n' + extraInfo) + ('\nReceived: ' + JSON.stringify(received)));
  } catch (err) {
    if (err.message === 'Converting circular structure to JSON') {
      return new TypeError('' + ('You should provide ' + expected) + ('\n' + extraInfo) + ('\nReceived a circular structure: ' + received));
    }
    throw err;
  }
};

// Response builder
var makeResponse = function makeResponse(work) {
  return '\n  self.onmessage = event => {\n    const args = event.data.message.args\n    if (args) {\n      self.postMessage((' + work + ').apply(null, args))\n      return close()\n    }\n    self.postMessage((' + work + ')())\n    return close()\n  }\n';
};

var createDisposableWorker = function createDisposableWorker(response) {
  var URL = window.URL || window.webkitURL;
  var blob = new Blob([response], { type: 'application/javascript' }); // eslint-disable-line
  var objectURL = URL.createObjectURL(blob);
  var worker = new Worker(objectURL); // eslint-disable-line
  worker.post = function (message) {
    return new Promise(function (resolve, reject) {
      worker.onmessage = function (event) {
        URL.revokeObjectURL(objectURL);
        resolve(event.data);
      };
      worker.onerror = function (e) {
        console.error('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
        reject(e);
      };
      worker.postMessage({ message: message });
    });
  };
  return worker;
};

var run = function run() {
  var work = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var args = arguments[1];

  var validWork = isValid(work)('function');
  var validArgs = isValid(args)(['array', 'undefined']);
  if (validWork && validArgs) {
    var worker = createDisposableWorker(makeResponse(work));
    return worker.post({ args: args });
  }
  if (!validWork) console.error(argumentError({ expected: 'a function', received: work }));
  if (!validArgs) console.error(argumentError({ expected: 'an array', received: args }));
  return null;
};

var warnWork = function warnWork(msg) {
  console.warn('WARN! ' + msg + ' is not a registered action for this worker');
  return msg + ' is not a registered action for this worker';
};

var post = function post(actions) {
  return function () {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var args = arguments[1];

    var validMessage = isValid(msg)('string');
    var validArgs = isValid(args)(['array', 'undefined']);
    if (validMessage && validArgs) {
      var work = actions.filter(function (_ref) {
        var message = _ref.message;
        return JSON.stringify(message) === JSON.stringify(msg);
      }).map(function (action) {
        return action.func;
      }).pop();

      if (!work) return run(warnWork, [JSON.stringify(msg)]);
      if (args) return run(work, args);
      return run(work);
    }

    if (!validMessage) console.error(argumentError({ expected: 'a string', received: msg }));
    if (!validArgs) console.error(argumentError({ expected: 'an array', received: args }));
    return null;
  };
};

// import { invalidObjectsArray, isArrayOf, notArray, returnNull, wrongLength, wrongObjects } from './utils'
var makeOptionsFor = function makeOptionsFor(arr) {
  return {
    expected: 'an array of arrays, an array of objects, or an array of strings',
    received: arr,
    extraInfo: 'If an array of arrays, ' + 'it must have the same length as the actions registered for this worker.\n' + 'If an array of objects, every object must containing two fields:\n* message\n* args'
  };
};
function postAll() {
  var _this = this;

  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (isValid(arr)(['arraysArray', 'postParamsArray', 'stringsArray'])) {
    if (arr.length === 0) return Promise.all(this.actions.map(function (_ref) {
      var message = _ref.message;
      return _this.postMessage(message);
    }));

    if (arr.every(function (item) {
      return typeof item === 'string';
    })) {
      return Promise.all(arr.map(function (msg) {
        return _this.postMessage(msg);
      }));
    }

    if (arr.every(function (item) {
      return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
    })) {
      return Promise.all(arr.map(function (_ref2) {
        var message = _ref2.message,
            args = _ref2.args;
        return _this.postMessage(message, args);
      }));
    }

    if (arr.every(function (item) {
      return Array.isArray(item);
    }) && arr.length === this.actions.length) {
      return Promise.all(arr.map(function (args, index) {
        return _this.postMessage(_this.actions[index].message, args);
      }));
    }
  }

  console.error(argumentError(makeOptionsFor(arr)));
  return null;
}

var isActionOf = function isActionOf(actions) {
  return function (newAction) {
    return actions.some(function (action) {
      return action.message === newAction.message;
    });
  };
};

var warnMsg = function warnMsg(action) {
  return 'WARN! An action with message "' + action.message + '" is already registered for this worker';
};

var pushInto = function pushInto(actions) {
  return function (action) {
    if (isActionOf(actions)(action)) {
      console.warn(warnMsg(action));
      return actions.length;
    }
    return actions.push(action);
  };
};

var makeOptionsFor$1 = function makeOptionsFor(action) {
  return {
    expected: 'an array of actions or an action',
    received: action,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  };
};

var register = function register(actions) {
  return function () {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (isValid(action)(['action', 'actionsArray'])) {
      if (Array.isArray(action)) {
        return action.reduce(function (actions, action) {
          pushInto(actions)(action);
          return actions;
        }, actions).length;
      }

      return pushInto(actions)(action);
    }
    console.error(argumentError(makeOptionsFor$1(action)));
    return null;
  };
};

var removeFrom = function removeFrom(actions) {
  return function (msg) {
    var index = actions.findIndex(function (_ref) {
      var message = _ref.message;
      return message === msg;
    });
    index === -1 ? console.warn('WARN! Impossible to unregister action with message "' + msg + '".\nIt is not a registered action for this worker.') : actions.splice(index, 1);
    return actions;
  };
};

var makeOptions = function makeOptions(msg) {
  return {
    expected: 'an array of strings or a string',
    received: msg
  };
};

var unregister = function unregister(actions) {
  return function () {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (isValid(msg)(['string', 'stringsArray'])) {
      if (Array.isArray(msg)) {
        return msg.reduce(function (actions, message) {
          removeFrom(actions)(message);
          return actions;
        }, actions).length;
      }
      return removeFrom(actions)(msg).length;
    }

    console.error(argumentError(makeOptions(msg)));
    return null;
  };
};

var options = function options(actions) {
  return {
    expected: 'an array of objects',
    received: actions,
    extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
  };
};

var create = function create() {
  var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

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

var createWrapper = function createWrapper() {
  if (!window.Worker) {
    console.error('This browser does not support Workers.');
    return null;
  }
  if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
    console.error('This browser does not have URL.createObjectURL method.');
    return null;
  }
  return { create: create, run: run };
};

var WorkerWrapper = createWrapper();
