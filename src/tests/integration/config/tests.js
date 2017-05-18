'use strict';

/* global WorkerWrapper */

// Run without args and without arrow function
var test1 = function test1() {
  var resultEl = document.querySelector('#result');
  return WorkerWrapper.run(function () {
    return 'Run without args and without arrow function';
  }).then(function (result) {
    resultEl.innerHTML = result;
    return result;
  }).catch(function (err) {
    return err;
  });
};

// Run without args and with arrow function
var test2 = function test2() {
  var resultEl = document.querySelector('#result');
  return WorkerWrapper.run(function () {
    return 'Run without args and with arrow function';
  }).then(function (result) {
    resultEl.innerHTML = result;
    return result;
  }).catch(function (err) {
    return err;
  });
};

// Run with args and without arrow function
var test3 = function test3() {
  var resultEl = document.querySelector('#result');
  return WorkerWrapper.run(function (arg1, arg2) {
    return 'Run ' + arg1 + ' and ' + arg2;
  }, ['with args', 'without arrow function']).then(function (result) {
    resultEl.innerHTML = result;
    return result;
  }).catch(function (err) {
    return err;
  });
};

// Run with args and with arrow function
var test4 = function test4() {
  var resultEl = document.querySelector('#result');
  return WorkerWrapper.run(function (arg1, arg2) {
    return 'Run ' + arg1 + ' and ' + arg2;
  }, ['with args', 'with arrow function']).then(function (result) {
    resultEl.innerHTML = result;
    return result;
  }).catch(function (err) {
    return err;
  });
};

// Run without args but expecting them
var test5 = function test5() {
  var resultEl = document.querySelector('#result');
  return WorkerWrapper.run(function (arg1, arg2) {
    return 'Run ' + arg1 + ' and ' + arg2;
  }).then(function (result) {
    resultEl.innerHTML = result;
    return result;
  }).catch(function (err) {
    return err;
  });
};

// Run without args but with default arg value
var test6 = function test6() {
  var resultEl = document.querySelector('#result');
  return WorkerWrapper.run(function () {
    var arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value';
    return 'Run with ' + arg1;
  }, undefined).then(function (result) {
    resultEl.innerHTML = result;
    return result;
  }).catch(function (err) {
    return err;
  });
};

// Run without args but without default
var test7 = function test7() {
  var resultEl = document.querySelector('#result');
  return WorkerWrapper.run(function (arg1) {
    return 'Run with ' + arg1;
  }, undefined).then(function (result) {
    resultEl.innerHTML = result;
    return result;
  }).catch(function (err) {
    return err;
  });
};

var tests = {
  run: {
    test1: test1, test2: test2, test3: test3, test4: test4, test5: test5, test6: test6, test7: test7
  }
};

var load = { module: function module() {} };
load.module(tests);
