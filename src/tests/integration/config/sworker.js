'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

// Argument validation
var isValidObjectsArray = function isValidObjectsArray(arr) {
  return function () {
    var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return arr.every(function (obj) {
      return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj) && fields.every(function (field) {
        return obj.hasOwnProperty(field);
      });
    });
  };
};

var testArray = {
  'actionsArray': function actionsArray(arr) {
    return isValidObjectsArray(arr)(['message', 'func']);
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
    return isValidObjectsArray(arr)(['message', 'args']);
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
    console.error(err);
    return new TypeError('You should provide something else...');
  }
};

// Response builder
var makeResponse = function makeResponse(work) {
  return '\n  self.onmessage = event => {\n    const args = event.data.message.args\n    if (args) {\n      self.postMessage((' + work + ').apply(null, args))\n      return close()\n    }\n    self.postMessage((' + work + ')())\n    return close()\n  }\n';
};

var createDisposableWorker = function createDisposableWorker(response) {
  var URL = window.URL || window.webkitURL;
  var blob = new Blob([response], { type: 'application/javascript' }); // eslint-disable-line
  var worker = new Worker(URL.createObjectURL(blob)); // eslint-disable-line
  worker.post = function (message) {
    return new Promise(function (resolve, reject) {
      worker.onmessage = function (event) {
        return resolve(event.data);
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
var options$1 = function options(arr) {
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

  console.error(argumentError(options$1(arr)));
  return null;
}

var pushInto = function pushInto(actions) {
  return function (action) {
    return actions.push(action);
  };
};

var register = function register(actions) {
  return function () {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var options = {
      expected: 'an array of actions or an action',
      received: action,
      extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
    };
    if (isValid(action)(['object', 'objectsArray'])(argumentError(options))) {
      if (Array.isArray(action)) {
        action.forEach(pushInto(actions));
        return actions.length;
      }
      return pushInto(actions)(action);
    }
    return null;
  };
};

var removeFrom = function removeFrom(actions) {
  return function (action) {
    var index = actions.findIndex(function (_ref) {
      var message = _ref.message;
      return message === action;
    });
    if (index === -1) {
      console.warn('WARN! Impossible to unregister ' + action + '.\n' + action + ' is not a registered action for this worker.');
      return [];
    }
    return actions.splice(index, 1);
  };
};

var unregister = function unregister(actions) {
  return function () {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var options = {
      expected: 'an array of strings or a string',
      received: msg
    };
    if (isValid(msg)(['string', 'stringsArray'])(argumentError(options))) {
      var remove = removeFrom(actions);

      if (Array.isArray(msg)) {
        var removed = msg.reduce(function (removed, action) {
          removed = removed.concat(remove(action));
          return removed;
        }, []);

        if (removed.length === 0) {
          console.warn('WARN! Impossible to unregister ' + JSON.stringify(msg) + '.' + '\nNone of the actions is a registered action for this worker.');
          return null;
        }
        return removed;
      }

      return remove(msg);
    }

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
