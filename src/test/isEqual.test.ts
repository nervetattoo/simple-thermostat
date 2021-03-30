import isEqual from '../isEqual'

test('isEqual works on shallow objects', () => {
  expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)

  expect(isEqual({ a: 2, b: 2 }, { a: 1, b: 2 })).toBe(false)

  expect(isEqual({ a: 1, b: 2, c: 1 }, { a: 1, b: 2 })).toBe(false)

  expect(isEqual({ a: 1, b: 2, c: 1 }, { a: 1, b: 2, c: '1' })).toBe(false)

  expect(isEqual({}, {})).toBe(true)
})

test('isEqual returns false on deep objects', () => {
  expect(isEqual({ foo: { a: 1 } }, { foo: { a: 1 } })).toBe(false)
})
