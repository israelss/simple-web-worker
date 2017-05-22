/* global fixture, test, unregisterTests */
import { ClientFunction, Selector } from 'testcafe'

fixture(`<worker>.unregister`)
  .page(`./config/index.html`)

test('A single action', async t => {
  const testResult = await ClientFunction(() => unregisterTests.t1())()
  const expected = 0
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})

test('An array of actions', async t => {
  const testResult = await ClientFunction(() => unregisterTests.t2())()
  const expected = 0
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})

test('A single not registered action', async t => {
  const testResult = await ClientFunction(() => unregisterTests.t3())()
  const expected = 0
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})

test('An array of not registered actions', async t => {
  const testResult = await ClientFunction(() => unregisterTests.t4())()
  const expected = 2
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})

test('An array with not registered actions and one registered action', async t => {
  const testResult = await ClientFunction(() => unregisterTests.t5())()
  const expected = 2
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})
