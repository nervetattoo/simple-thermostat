import renderInfoItem from '../components/infoItem'
import { render } from 'lit-html'

test('return undefined on hide and no state', () => {
  const firstResult = renderInfoItem({
    hide: true,
    state: 'foo',
    details: {},
  })
  expect(firstResult).toBe(undefined)

  expect(
    renderInfoItem({
      hide: false,
      state: '',
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
    state: spec.value,
    details: { heading: spec.heading, icon: 'test' },
  })

  render(result, document.body)
  const heading = document.body.querySelector('div').innerHTML
  const value = document.body.querySelector('div:last-child').textContent

  // TODO Spaces exist in render result. For sanitys sake they should probably be removed
  expect(heading).toContain('<ha-icon icon="test"')
  expect(value).toBe(spec.value)
})
