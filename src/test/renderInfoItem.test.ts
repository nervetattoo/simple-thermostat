import renderInfoItem from '../components/infoItem'
import { render } from 'lit'

test('return undefined on hide and no state', () => {
  const firstResult = renderInfoItem({
    hide: true,
    hass: {},
    state: 'foo',
    details: {},
  })
  expect(firstResult).toBe(undefined)

  expect(
    renderInfoItem({
      hide: false,
      hass: {},
      state: undefined,
      details: {},
    })
  ).toBe(undefined)
})

test('render into dom', () => {
  const spec = {
    heading: 'Temperature',
    value: '4℃',
  }
  const result = renderInfoItem({
    hide: false,
    hass: {},
    state: spec.value,
    details: { heading: spec.heading },
  })

  render(result, document.body)
  const heading = document.body.querySelector('div').textContent
  const value = document.body.querySelector('div:last-child').textContent

  // TODO Spaces exist in render result. For sanitys sake they should probably be removed
  expect(heading).toBe(` ${spec.heading}: `)
  expect(value).toBe(spec.value)
})

test('render with icon', () => {
  const spec = {
    heading: 'Temperature',
    value: '4℃',
  }
  const result = renderInfoItem({
    hide: false,
    hass: {},
    state: spec.value,
    details: { heading: spec.heading, icon: 'test' },
  })

  render(result, document.body)
  const iconEl = document.body.querySelector('ha-icon') as any
  const value = document.body.querySelector('div:last-child').textContent

  // ha-icon uses property binding (Lit 3 / HA 2021.11+), so the icon is
  // set as a property, not an attribute. Verify the property is set.
  expect(iconEl).not.toBeNull()
  expect(iconEl.icon).toBe('test')
  expect(value).toBe(spec.value)
})
