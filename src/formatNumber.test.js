import test from 'ava'
import formatNumber from './formatNumber'

test('formatNumber with valid numbers', t => {
  t.is(formatNumber(10), '10.0')
  t.is(formatNumber('10'), '10.0')
  t.is(formatNumber(10, { decimals: 0 }), '10')
  t.is(formatNumber('10.4', { decimals: 0 }), '10')
  t.is(formatNumber(10.6, { decimals: 0 }), '11')
  t.is(formatNumber(10.6, { decimals: 1 }), '10.6')
})

test('formatNumber with invalid numbers', t => {
  t.is(formatNumber(null), 'N/A')
  t.is(formatNumber(false), 'N/A')
  t.is(formatNumber(true), 'N/A')
  t.is(formatNumber(''), 'N/A')
  t.is(formatNumber(undefined), 'N/A')
})

// Not implemented yet
test.skip('formatNumber with multiple decimals', t => {
  t.is(formatNumber(1.23, { decimals: 2 }), '1.23')
  t.is(formatNumber(1.2, { decimals: 2 }), '1.20')
})
