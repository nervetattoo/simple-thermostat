import getEntityType, { SINGLE, DUAL } from '../getEntityType'

test('getEntityType dual', () => {
  expect(
    getEntityType({
      target_temp_high: 20,
      target_temp_low: 16,
    })
  ).toBe(DUAL)
  expect(
    getEntityType({
      temperature: 18,
      target_temp_high: 20,
      target_temp_low: 16,
    })
  ).toBe(DUAL)
})

test('getEntityType single', () => {
  expect(getEntityType({ temperature: 18 })).toBe(SINGLE)
  expect(
    getEntityType({
      temperature: 18,
      target_temp_low: 17,
    })
  ).toBe(SINGLE)
})
