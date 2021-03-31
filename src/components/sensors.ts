import { html } from 'lit-html'
import formatNumber from '../formatNumber'
import renderInfoItem from './infoItem'

export default function renderSensors({
  _hide,
  entity,
  unit,
  sensors,
  config,
  localize,
  openEntityPopover,
}) {
  const {
    attributes: { hvac_action: action, current_temperature: current },
  } = entity
  const sensorHtml = [
    renderInfoItem({
      hide: _hide.temperature,
      state: `${formatNumber(current, config)}${unit}`,
      details: {
        heading:
          config?.label?.temperature ?? localize('ui.card.climate.currently'),
      },
    }),
    renderInfoItem({
      hide: _hide.state,
      state: localize(action, 'state_attributes.climate.hvac_action.'),
      details: {
        heading:
          config?.label?.state ??
          localize('ui.panel.lovelace.editor.card.generic.state'),
      },
    }),
    ...(sensors.map(({ name, icon, state, unit }) => {
      return (
        state &&
        renderInfoItem({
          hide: false,
          state,
          localize,
          openEntityPopover,
          details: { heading: name, icon, unit },
        })
      )
    }) || null),
  ].filter((it) => it !== null)

  return html` <div class="sensors">${sensorHtml}</div> `
}
