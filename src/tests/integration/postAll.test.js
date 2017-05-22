/* global fixture, test, postAllTests */
import { ClientFunction, Selector } from 'testcafe'

const JSONreplacer = (key, value) => {
  if (value instanceof Function) return value.toString()
  if (value === undefined) return 'undefined'
  return value
}

const stringify = (msg, replacer = JSONreplacer) => JSON.stringify(msg, replacer)

fixture(`<worker>.postAll`)
  .page(`./config/index.html`)

test('Without args, without message', async t => {
  const testResult = await ClientFunction(() => postAllTests.t1())()
  const expected = stringify(['a', 'b', 'undefined', 'default'])
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('array')
  await t.expect(stringify(testResult)).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('One message (array of strings)', async t => {
  const testResult = await ClientFunction(() => postAllTests.t2())()
  const expected = stringify(['a'])
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('array')
  await t.expect(stringify(testResult)).eql(expected)
  await t.expect(testParagraph).eql(expected)
})


test('More than one message (array of strings)', async t => {
  const testResult = await ClientFunction(() => postAllTests.t3())()
  const expected = stringify(['a', 'b'])
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('array')
  await t.expect(stringify(testResult)).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('One message (array of objects)', async t => {
  const testResult = await ClientFunction(() => postAllTests.t4())()
  const expected = stringify(['a'])
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('array')
  await t.expect(stringify(testResult)).eql(expected)
  await t.expect(testParagraph).eql(expected)
})


test('More than one message (array of objects)', async t => {
  const testResult = await ClientFunction(() => postAllTests.t5())()
  const expected = stringify(['a', 'b'])
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('array')
  await t.expect(stringify(testResult)).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('Array of arrays (null in every array)', async t => {
  const testResult = await ClientFunction(() => postAllTests.t6())()
  const expected = stringify(['a', 'b', null, null])
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('array')
  await t.expect(stringify(testResult)).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('Array of arrays (overwriting a default value)', async t => {
  const testResult = await ClientFunction(() => postAllTests.t7())()
  const expected = stringify(['a', 'b', 'something', 'overwrited'])
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('array')
  await t.expect(stringify(testResult)).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('Array of arrays (relying on a default value)', async t => {
  const testResult = await ClientFunction(() => postAllTests.t8())()
  const expected = stringify(['a', 'b', 'something', 'default'])
  const testParagraph = Selector('#result').textContent
  await t.expect(testResult).typeOf('array')
  await t.expect(stringify(testResult)).eql(expected)
  await t.expect(testParagraph).eql(expected)
})
