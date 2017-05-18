'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var isArrayOf = function isArrayOf(type) {
  return function (arr) {
    var testItems = null;
    if (type === 'arrays') testItems = function testItems(item) {
      return Array.isArray(item);
    };
    if (type === 'objects') testItems = function testItems(item) {
      return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
    };
    if (type === 'strings') testItems = function testItems(item) {
      return typeof item === 'string';
    };

    if (testItems) return arr.every(testItems);
    return false;
  };
};

var notValid = function notValid(argumentError) {
  console.error(argumentError);
  return false;
};

var invalidActions = function invalidActions() {
  var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return function () {
    var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (Array.isArray(actions)) {
      if (types === 'objectsArray' || types === 'actionsArray') return actions.some(function (action) {
        return (typeof action === 'undefined' ? 'undefined' : _typeof(action)) !== 'object' || Array.isArray(action) || action === null;
      });
      if (types === 'stringsArray') return actions.some(function (action) {
        return typeof action !== 'string';
      });
    }
    return false;
  };
};

var isValidArg = function isValidArg(arg) {
  return function () {
    var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (types === 'null') return arg === null;

    if (types === 'undefined') return arg === undefined;

    if (Array.isArray(types)) return types.some(function (type) {
      return isValidArg(arg)(type);
    });

    if (!arg || wrongType(arg, types) || invalidActions(arg)(types)) return false;
    return true;
  };
};

var wrongType = function wrongType() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (Array.isArray(type)) return type.every(function (type) {
    return wrongType(obj, type);
  });

  if (Array.isArray(obj)) {
    if (type === 'actionsArray') return invalidObjectsArray(obj)(['message', 'func']);
    if (type === 'objectsArray' || type === 'stringsArray' || type === 'array') return false;
    return true;
  }

  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== type.toString(); // eslint-disable-line
};

var invalidObjectsArray = function invalidObjectsArray(arr) {
  return function (fields) {
    return arr.some(function (obj) {
      return !fields.every(function (field) {
        return obj.hasOwnProperty(field);
      });
    });
  };
};

var isValidArgument = function isValidArgument(arg) {
  return function () {
    var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    return function () {
      var argumentError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (Array.isArray(types)) {
        if (types.some(function (type) {
          return isValidArg(arg)(type);
        })) return true;

        return notValid(argumentError);
      }

      if (!arg || wrongType(arg, types) || invalidActions(arg)(types)) return notValid(argumentError);
      return true;
    };
  };
};

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

var filterActions = function filterActions(actions, msg) {
  return actions.filter(function (_ref2) {
    var message = _ref2.message;
    return JSON.stringify(message) === JSON.stringify(msg);
  }).map(function (action) {
    return action.func;
  }).pop();
};

var removeFrom = function removeFrom(actions) {
  return function (action) {
    var index = actions.findIndex(function (_ref3) {
      var message = _ref3.message;
      return message === action;
    });
    if (index === -1) {
      console.warn('WARN! Impossible to unregister ' + action + '.\n' + action + ' is not a registered action for this worker.');
      return [];
    }
    return actions.splice(index, 1);
  };
};

var makeResponse = function makeResponse(work) {
  return '\n  self.onmessage = event => {\n    const args = event.data.message.args\n    if (args) {\n      self.postMessage((' + work + ').apply(null, args))\n      return close()\n    }\n    self.postMessage((' + work + ')())\n    return close()\n  }\n';
};

var pushInto = function pushInto(actions) {
  return function (action) {
    return actions.push(action);
  };
};

var notArray = function notArray(arr) {
  return argumentError(notArrayOptions(arr));
};
var notArrayOptions = function notArrayOptions(arr) {
  return {
    expected: 'an array of strings, an array of objects, an array of arrays or no arguments',
    received: arr
  };
};

var wrongLength = function wrongLength(actualLength) {
  return function (expectedLength) {
    return argumentError(wrongLengthOptions(actualLength)(expectedLength));
  };
};
var wrongLengthOptions = function wrongLengthOptions(actualLength) {
  return function (expectedLength) {
    return {
      received: actualLength,
      expected: 'the same number of [args] as the number of registered actions on the worker',
      extraInfo: 'This worker has ' + expectedLength + ' actions registered'
    };
  };
};

var wrongObjects = function wrongObjects(arr) {
  return argumentError(wrongObjectsOptions(arr));
};
var wrongObjectsOptions = function wrongObjectsOptions(arr) {
  return {
    expected: arr,
    extraInfo: 'Every object of the array must contain the following fields:\n* message\n* args'
  };
};

var returnNull = function returnNull(error) {
  console.error(error);
  return null;
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

  if (!isValidArgument(work)('function')(argumentError({ expected: 'a function', received: work }))) {
    return null;
  }
  if (!isValidArgument(args)(['array', 'undefined'])(argumentError({ expected: 'an array', received: args }))) {
    return null;
  }
  var response = makeResponse(work);
  return createDisposableWorker(response).post({ args: args });
};

var post = function post(actions) {
  return function () {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var args = arguments[1];

    var validWork = isValidArgument(msg)('string')(argumentError({ expected: 'a string', received: msg }));
    var validArgs = isValidArgument(args)(['array', 'undefined'])(argumentError({ expected: 'an array', received: args }));
    if (validWork && validArgs) {
      var work = filterActions(actions, msg);

      if (!work) {
        work = function work(msg) {
          console.warn('WARN! ' + msg + ' is not a registered action for this worker');
          return msg + ' is not a registered action for this worker';
        };
        args = JSON.stringify(msg);
        return run(work, [args]);
      }
      if (args) return run(work, args);

      return run(work);
    }
    return null;
  };
};

function postAll() {
  var _this = this;

  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!Array.isArray(arr)) return returnNull(notArray(arr));

  var isArraysArray = isArrayOf('arrays')(arr);
  var isObjectsArray = isArrayOf('objects')(arr);
  var isStringsArray = isArrayOf('strings')(arr);

  if (!(isArraysArray || isObjectsArray || isStringsArray)) return returnNull(notArray(arr));

  if (arr.length === 0) return Promise.all(this.actions.map(function (_ref) {
    var message = _ref.message;
    return _this.postMessage(message);
  }));

  if (isStringsArray) return Promise.all(arr.map(function (msg) {
    return _this.postMessage(msg);
  }));

  if (isObjectsArray) {
    if (invalidObjectsArray(arr)(['message', 'args'])) return returnNull(wrongObjects(arr));
    return Promise.all(arr.map(function (_ref2) {
      var message = _ref2.message,
          args = _ref2.args;
      return _this.postMessage(message, args);
    }));
  }

  if (isArraysArray) {
    if (arr.length !== this.actions.length) {
      return returnNull(wrongLength(arr.length)(this.actions.length));
    }
    return Promise.all(arr.map(function (args, index) {
      return _this.postMessage(_this.actions[index].message, args);
    }));
  }
}

var register = function register(actions) {
  return function () {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var options = {
      expected: 'an array of actions or an action',
      received: action,
      extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
    };
    if (isValidArgument(action)(['object', 'objectsArray'])(argumentError(options))) {
      if (Array.isArray(action)) {
        action.forEach(pushInto(actions));
        return actions.length;
      }
      return pushInto(actions)(action);
    }
    return null;
  };
};

var unregister = function unregister(actions) {
  return function () {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var options = {
      expected: 'an array of strings or a string',
      received: msg
    };
    if (isValidArgument(msg)(['string', 'stringsArray'])(argumentError(options))) {
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

  if (isValidArgument(actions)('actionsArray')(argumentError(options(actions)))) {
    return {
      actions: actions,
      postMessage: post(actions),
      postAll: postAll,
      register: register(actions),
      unregister: unregister(actions)
    };
  }
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
