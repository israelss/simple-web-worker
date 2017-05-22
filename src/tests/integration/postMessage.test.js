/* global fixture, test, postMessageTests */
import { ClientFunction, Selector } from 'testcafe'

fixture(`<worker>.postMessage`)
  .page(`./config/index.html`)

test('Without args when does not expect args', async t => {
  const testResult = await ClientFunction(() => postMessageTests.t1())()
  const expected = 'a'
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('string')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('Without args when does expect args', async t => {
  const testResult = await ClientFunction(() => postMessageTests.t2())()
  const expected = 'undefined'
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('string')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('Without args when have default args', async t => {
  const testResult = await ClientFunction(() => postMessageTests.t3())()
  const expected = 'default arg value'
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('string')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args when does not expect args', async t => {
  const testResult = await ClientFunction(() => postMessageTests.t4())()
  const expected = 'a'
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('string')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args when does expect args', async t => {
  const testResult = await ClientFunction(() => postMessageTests.t5())()
  const expected = 'a'
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('string')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args when have default args', async t => {
  const testResult = await ClientFunction(() => postMessageTests.t6())()
  const expected = 'a'
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('string')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('A message that points to a non existent function', async t => {
  const testResult = await ClientFunction(() => postMessageTests.t7())()
  const expected = '"Darth Vader" is not a registered action for this worker'
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('string')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})
