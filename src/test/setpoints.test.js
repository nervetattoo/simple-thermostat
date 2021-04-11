import parseSetpoints from '../config/setpoints'

test('single setpoint', () => {
  const match = { temperature: 20 }

  expect(
    parseSetpoints(
      { temperature: null },
      { temperature: 20, target_temp_low: 19 }
    )
  ).toEqual(match)

  expect(
    parseSetpoints(null, { temperature: 20, target_temp_low: 19 })
  ).toEqual(match)
})

test('dual setpoint', () => {
  const result = parseSetpoints(
    { target_temp_low: null, target_temp_high: null },
    { target_temp_high: 20, target_temp_low: 19 }
  )

  expect(result).toEqual({ target_temp_high: 20, target_temp_low: 19 })
})

test('dual setpoint defaults', () => {
  const result = parseSetpoints(undefined, {
    target_temp_high: 20,
    target_temp_low: 19,
  })

  expect(result).toEqual({ target_temp_high: 20, target_temp_low: 19 })
})

test('dual setpoint hide one', () => {
  const result = parseSetpoints(
    { target_temp_low: { hide: true }, target_temp_high: null },
    { target_temp_high: 20, target_temp_low: 19 }
  )

  expect(result).toEqual({ target_temp_high: 20 })
})
