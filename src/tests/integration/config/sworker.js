// src/utils.js
var isValidObjectWith = (fields) => (obj) => !!obj && !Array.isArray(obj) && fields.every((field) => Object.getOwnPropertyNames(obj).includes(field));
var isValidAction = (obj) => {
  return isValidObjectWith(["message", "func"])(obj) && typeof obj.func === "function" && typeof obj.message === "string";
};
var isValidActionsArray = (arr) => arr.every(isValidAction);
var isValidPostParams = (obj) => {
  return isValidObjectWith(["message", "args"])(obj) && Array.isArray(obj.args) && typeof obj.message === "string";
};
var isValidPostParamsArray = (arr) => arr.every(isValidPostParams);
var isValidObjectsArray = (arr) => (fields = []) => arr.every(isValidObjectWith(fields));
var testArray = {
  actionsArray: (arr) => isValidActionsArray(arr),
  arraysArray: (arr) => arr.every((item) => Array.isArray(item)),
  objectsArray: (arr) => isValidObjectsArray(arr)(),
  postParamsArray: (arr) => isValidPostParamsArray(arr),
  stringsArray: (arr) => arr.every((item) => typeof item === "string")
};
var isValidArg = (arg) => (type) => {
  if (type === "null")
    return arg === null;
  if (type === "undefined")
    return arg === void 0;
  if (type === "action")
    return isValidAction(arg);
  if (Array.isArray(arg)) {
    if (type !== "array" && !testArray[type])
      return false;
    if (type === "array")
      return true;
    return testArray[type](arg);
  }
  if (arg)
    return typeof arg === type.toString();
  return false;
};
var isValid = (argument) => (types = null) => {
  if (Array.isArray(types))
    return types.some((type) => isValidArg(argument)(type));
  if (isValidArg(argument)(types))
    return true;
  return false;
};
var argumentError = ({ expected = "", received, extraInfo = "" }) => {
  try {
    return new TypeError(`${"You should provide " + expected}${"\n" + extraInfo}${"\nReceived: " + JSON.stringify(received)}`);
  } catch (err) {
    if (err.message.includes("Converting circular structure to JSON")) {
      return new TypeError(`${"You should provide " + expected}${"\n" + extraInfo}${"\nReceived a circular structure: " + received}`);
    }
    throw err;
  }
};
var makeResponse = (work) => `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      self.postMessage((${work}).apply(null, args))
      return close()
    }
    self.postMessage((${work})())
    return close()
  }
`;

// src/createDisposableWorker.js
var createDisposableWorker = (response) => {
  const URL = window.URL || window.webkitURL;
  const blob = new Blob([response], { type: "application/javascript" });
  const objectURL = URL.createObjectURL(blob);
  const worker = new Worker(objectURL);
  worker.post = (message) => new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      URL.revokeObjectURL(objectURL);
      resolve(event.data);
    };
    worker.onerror = (e) => {
      console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`);
      reject(e);
    };
    worker.postMessage({ message });
  });
  return worker;
};

// src/run.js
var run = (work = null, args) => {
  const validWork = isValid(work)("function");
  const validArgs = isValid(args)(["array", "undefined"]);
  if (validWork && validArgs) {
    const worker = createDisposableWorker(makeResponse(work));
    return worker.post({ args });
  }
  if (!validWork)
    console.error(argumentError({ expected: "a function", received: work }));
  if (!validArgs)
    console.error(argumentError({ expected: "an array", received: args }));
  return null;
};

// src/post.js
var warnWork = (msg) => {
  console.warn(`WARN! ${msg} is not a registered action for this worker`);
  return `${msg} is not a registered action for this worker`;
};
var post = (actions) => (msg = null, args) => {
  const validMessage = isValid(msg)("string");
  const validArgs = isValid(args)(["array", "undefined"]);
  if (validMessage && validArgs) {
    const work = actions.filter(({ message }) => JSON.stringify(message) === JSON.stringify(msg)).map((action) => action.func).pop();
    if (!work)
      return run(warnWork, [JSON.stringify(msg)]);
    if (args)
      return run(work, args);
    return run(work);
  }
  if (!validMessage)
    console.error(argumentError({ expected: "a string", received: msg }));
  if (!validArgs)
    console.error(argumentError({ expected: "an array", received: args }));
  return null;
};

// src/postAll.js
var makeOptionsFor = (arr) => {
  return {
    expected: "an array of arrays, an array of objects, or an array of strings",
    received: arr,
    extraInfo: "If an array of arrays, it must have the same length as the actions registered for this worker.\nIf an array of objects, every object must containing two fields:\n* message\n* args"
  };
};
function postAll(arr = []) {
  if (isValid(arr)(["arraysArray", "postParamsArray", "stringsArray"])) {
    if (arr.length === 0)
      return Promise.all(this.actions.map(({ message }) => this.postMessage(message)));
    if (arr.every((item) => typeof item === "string")) {
      return Promise.all(arr.map((msg) => this.postMessage(msg)));
    }
    if (arr.every((item) => typeof item === "object" && !Array.isArray(item))) {
      return Promise.all(arr.map(({ message, args }) => this.postMessage(message, args)));
    }
    if (arr.every((item) => Array.isArray(item)) && arr.length === this.actions.length) {
      return Promise.all(arr.map((args, index) => this.postMessage(this.actions[index].message, args)));
    }
  }
  console.error(argumentError(makeOptionsFor(arr)));
  return null;
}

// src/register.js
var isActionOf = (actions) => (newAction) => actions.some((action) => action.message === newAction.message);
var warnMsg = (action) => `WARN! An action with message "${action.message}" is already registered for this worker`;
var pushInto = (actions) => (action) => {
  if (isActionOf(actions)(action)) {
    console.warn(warnMsg(action));
    return actions.length;
  }
  return actions.push(action);
};
var makeOptionsFor2 = (action) => {
  return {
    expected: "an array of actions or an action",
    received: action,
    extraInfo: "Every action should be an object containing two fields:\n* message\n* func"
  };
};
var register = (actions) => (action = null) => {
  if (isValid(action)(["action", "actionsArray"])) {
    if (Array.isArray(action)) {
      return action.reduce((actions2, action2) => {
        pushInto(actions2)(action2);
        return actions2;
      }, actions).length;
    }
    return pushInto(actions)(action);
  }
  console.error(argumentError(makeOptionsFor2(action)));
  return null;
};

// src/unregister.js
var removeFrom = (actions) => (msg) => {
  const index = actions.findIndex(({ message }) => message === msg);
  index === -1 ? console.warn(`WARN! Impossible to unregister action with message "${msg}".
It is not a registered action for this worker.`) : actions.splice(index, 1);
  return actions;
};
var makeOptions = (msg) => {
  return {
    expected: "an array of strings or a string",
    received: msg
  };
};
var unregister = (actions) => (msg = null) => {
  if (isValid(msg)(["string", "stringsArray"])) {
    if (Array.isArray(msg)) {
      return msg.reduce((actions2, message) => {
        removeFrom(actions2)(message);
        return actions2;
      }, actions).length;
    }
    return removeFrom(actions)(msg).length;
  }
  console.error(argumentError(makeOptions(msg)));
  return null;
};

// src/create.js
var options = (actions) => {
  return {
    expected: "an array of objects",
    received: actions,
    extraInfo: "Every action should be an object containing two fields:\n* message\n* func"
  };
};
var create = (actions = []) => {
  if (isValid(actions)("actionsArray")) {
    return {
      actions,
      postMessage: post(actions),
      postAll,
      register: register(actions),
      unregister: unregister(actions)
    };
  }
  console.error(argumentError(options(actions)));
  return null;
};

// src/index.js
var createWrapper = () => {
  if (!window.Worker) {
    console.error("This browser does not support Workers.");
    return null;
  }
  if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
    console.error("This browser does not have URL.createObjectURL method.");
    return null;
  }
  return { create, run };
};
var WorkerWrapper = createWrapper();
//# sourceMappingURL=sworker.js.map
