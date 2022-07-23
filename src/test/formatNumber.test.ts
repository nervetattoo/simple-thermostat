import formatNumber from '../formatNumber'

test('formatNumber with valid numbers', () => {
  expect(formatNumber(10)).toBe('10.0')
  expect(formatNumber('10')).toBe('10.0')
  expect(formatNumber(10, { decimals: 0 })).toBe('10')
  expect(formatNumber('10.4', { decimals: 0 })).toBe('10')
  expect(formatNumber(10.6, { decimals: 0 })).toBe('11')
  expect(formatNumber(10.6, { decimals: 1 })).toBe('10.6')
})

test('formatNumber with invalid numbers', () => {
  ;[null, false, true, '', undefined].forEach((input) => {
    expect(formatNumber(input)).toBe('N/A')
  })
})

test('formatNumber with multiple decimals', () => {
  expect(formatNumber(1.23, { decimals: 2 })).toBe('1.23')
  expect(formatNumber(1.2, { decimals: 2 })).toBe('1.20')
  expect(formatNumber(1.23, { decimals: 1 })).toBe('1.2')
})
