import parseHeader from '../config/header'

const makeHass = (states: Record<string, any> = {}) => ({
  states,
  localize: (key: string) => key,
})

const makeEntity = (overrides = {}) => ({
  state: 'heat',
  entity_id: 'climate.test',
  attributes: {
    friendly_name: 'Test Thermostat',
    hvac_action: null,
    ...overrides,
  },
})

describe('parseHeader', () => {
  test('returns false when config is false', () => {
    expect(parseHeader(false, makeEntity(), makeHass())).toBe(false)
  })

  test('uses entity friendly_name by default', () => {
    const result = parseHeader({}, makeEntity(), makeHass())
    expect(result).not.toBe(false)
    if (result !== false) {
      expect(result.name).toBe('Test Thermostat')
    }
  })

  test('uses configured name when provided', () => {
    const result = parseHeader({ name: 'My Heater' }, makeEntity(), makeHass())
    expect(result).not.toBe(false)
    if (result !== false) {
      expect(result.name).toBe('My Heater')
    }
  })

  test('toggle returns null when entity does not exist in hass.states', () => {
    const result = parseHeader(
      { toggle: { entity: 'switch.nonexistent' } },
      makeEntity(),
      makeHass({}) // empty states — entity not found
    )
    expect(result).not.toBe(false)
    if (result !== false) {
      expect(result.toggle).toBeNull()
    }
  })

  test('toggle resolves correctly when entity exists', () => {
    const hass = makeHass({
      'switch.heater': {
        state: 'on',
        entity_id: 'switch.heater',
        attributes: { friendly_name: 'Heater Switch' },
      },
    })
    const result = parseHeader(
      { toggle: { entity: 'switch.heater', name: true } },
      makeEntity(),
      hass
    )
    expect(result).not.toBe(false)
    if (result !== false) {
      expect(result.toggle).not.toBeNull()
      expect(result.toggle?.label).toBe('Heater Switch')
    }
  })
})
