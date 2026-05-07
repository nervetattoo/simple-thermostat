import { HVAC_MODES } from '../types'

// Extracted sort logic — mirrors the implementation in main.ts
function sortHvacModes(
  list: Array<{ value: string; icon: string; name: string }>
) {
  const hvacModeValues = Object.values(HVAC_MODES) as Array<string>
  const known: typeof list = []
  const unknown: typeof list = []
  list.forEach((item) => {
    const index = hvacModeValues.indexOf(item.value)
    if (index >= 0) {
      known[index] = item
    } else {
      unknown.push(item)
    }
  })
  return [...known.filter(Boolean), ...unknown]
}

describe('HVAC mode sorting', () => {
  test('sorts known modes in canonical order', () => {
    const input = [
      { value: 'cool', icon: '', name: 'cool' },
      { value: 'heat', icon: '', name: 'heat' },
      { value: 'off', icon: '', name: 'off' },
    ]
    const result = sortHvacModes(input)
    expect(result.map((m) => m.value)).toEqual(['off', 'heat', 'cool'])
  })

  test('appends unknown modes at the end instead of dropping them', () => {
    const input = [
      { value: 'heat', icon: '', name: 'heat' },
      { value: 'custom_mode', icon: '', name: 'custom_mode' }, // unknown
    ]
    const result = sortHvacModes(input)
    expect(result.map((m) => m.value)).toContain('custom_mode')
    expect(result[result.length - 1].value).toBe('custom_mode')
  })

  test('does not produce undefined/empty slots from sparse array', () => {
    const input = [
      { value: 'auto', icon: '', name: 'auto' },
      { value: 'off', icon: '', name: 'off' },
    ]
    const result = sortHvacModes(input)
    expect(result.every((m) => m !== undefined)).toBe(true)
    expect(result.map((m) => m.value)).toEqual(['off', 'auto'])
  })

  test('handles all-unknown list without dropping any', () => {
    const input = [
      { value: 'turbo', icon: '', name: 'turbo' },
      { value: 'sleep', icon: '', name: 'sleep' },
    ]
    const result = sortHvacModes(input)
    expect(result).toHaveLength(2)
    expect(result.map((m) => m.value)).toEqual(['turbo', 'sleep'])
  })

  test('handles empty list', () => {
    expect(sortHvacModes([])).toEqual([])
  })
})
