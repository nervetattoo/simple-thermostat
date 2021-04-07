import { html } from 'lit-html'
import formatNumber from '../formatNumber'
import { LooseObject } from '../types'

interface InfoItemDetails extends LooseObject {
  heading?: string | false
  icon?: string
  unit?: string
  decimals?: number
}

interface InfoItemOptions {
  hide: boolean
  state: any
  localize?
  openEntityPopover?
  details: InfoItemDetails
}

// Preset mode can be  one of: none, eco, away, boost, comfort, home, sleep, activity
// See https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/components/climate/const.py#L36-L57

export default function renderInfoItem({
  hide,
  state,
  details,
  localize,
  openEntityPopover,
}: InfoItemOptions) {
  if (hide || !state) return

  const { heading, icon, unit, decimals } = details

  let valueCell
  if (typeof state === 'object') {
    const [domain] = state.entity_id.split('.')
    const prefix = [
      'component',
      domain,
      'state',
      state.attributes?.device_class ?? '_',
      '',
    ].join('.')
    let value = localize(state.state, prefix)
    if (typeof decimals === 'number') {
      value = formatNumber(value, { decimals })
    }
    valueCell = html`
      <div
        class="sensor-value clickable"
        @click="${() => openEntityPopover(state.entity_id)}"
      >
        ${value} ${unit || state.attributes.unit_of_measurement}
      </div>
    `
  } else {
    let value =
      typeof decimals === 'number' ? formatNumber(state, { decimals }) : state
    valueCell = html` <div class="sensor-value">${value}${unit}</div> `
  }

  if (heading === false) {
    return valueCell
  }

  const headingResult = icon
    ? html` <ha-icon icon="${icon}"></ha-icon> `
    : html` ${heading}: `

  return html`
    <div class="sensor-heading">${headingResult}</div>
    ${valueCell}
  `
}
