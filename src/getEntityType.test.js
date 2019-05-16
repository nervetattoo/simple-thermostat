import test from 'ava'
import getEntityType, { SINGLE, DUAL } from './getEntityType'

test('getEntityType dual', t => {
  t.is(
    getEntityType({
      target_temp_high: 20,
      target_temp_low: 16,
    }),
    DUAL
  )
  t.is(
    getEntityType({
      temperature: 18,
      target_temp_high: 20,
      target_temp_low: 16,
    }),
    DUAL
  )
})

test('getEntityType single', t => {
  t.is(getEntityType({ temperature: 18 }), SINGLE)
  t.is(
    getEntityType({
      temperature: 18,
      target_temp_low: 17,
    }),
    SINGLE
  )
})
