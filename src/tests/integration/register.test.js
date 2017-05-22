/* global fixture, test, registerTests */
import { ClientFunction, Selector } from 'testcafe'

fixture(`<worker>.register`)
  .page(`./config/index.html`)

test('A single action', async t => {
  const testResult = await ClientFunction(() => registerTests.t1())()
  const expected = 1
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})

test('An array of actions', async t => {
  const testResult = await ClientFunction(() => registerTests.t2())()
  const expected = 2
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})

test('A single already registered action', async t => {
  const testResult = await ClientFunction(() => registerTests.t3())()
  const expected = 1
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})

test('An array of already registered actions', async t => {
  const testResult = await ClientFunction(() => registerTests.t4())()
  const expected = 2
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})

test('An array with already registered actions and one new action', async t => {
  const testResult = await ClientFunction(() => registerTests.t5())()
  const expected = 3
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('number')
  await t.expect(testResult).eql(expected)
  await t.expect(testParagraph).eql(expected.toString())
})
