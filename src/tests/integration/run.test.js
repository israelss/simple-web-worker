/* global fixture, test, runTests */
import { ClientFunction, Selector } from 'testcafe'

fixture(`SWorker.run`)
  .page(`./config/index.html`)

test('Without args && without =>', async t => {
  const workerResult = await ClientFunction(() => runTests.t1())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run without args and without arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('Without args && with =>', async t => {
  const workerResult = await ClientFunction(() => runTests.t2())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run without args and with arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args && without =>', async t => {
  const workerResult = await ClientFunction(() => runTests.t3())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run with args and without arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args && with =>', async t => {
  const workerResult = await ClientFunction(() => runTests.t4())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run with args and with arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With no args (but expecting args)', async t => {
  const workerResult = await ClientFunction(() => runTests.t5())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run undefined and undefined'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args === undefined && default arg value', async t => {
  const workerResult = await ClientFunction(() => runTests.t6())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run with default arg value'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args === undefined && no default', async t => {
  const workerResult = await ClientFunction(() => runTests.t7())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run with undefined'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})
