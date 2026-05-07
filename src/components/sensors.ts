import { html } from 'lit'
import formatNumber from '../formatNumber'
import renderInfoItem from './infoItem'
import { wrapSensors } from './templated'

export default function renderSensors({
  _hide,
  entity,
  unit,
  hass,
  sensors,
  config,
  localize,
  openEntityPopover,
}) {
  const {
    state,
    attributes: { hvac_action: action, current_temperature: current },
  } = entity

  const showLabels = config?.layout?.sensors?.labels ?? true
  let stateString =
    hass.formatEntityState?.(entity) ??
    localize(state, 'component.climate.state._.')
  if (action) {
    const actionLabel =
      localize(
        action,
        'component.climate.entity_component._.state_attributes.hvac_action.state.'
      ) || localize(action, 'state_attributes.climate.hvac_action.')
    stateString = [actionLabel, ` (${stateString})`].join('')
  }
  const sensorHtml = [
    renderInfoItem({
      hide: _hide.temperature,
      state: `${formatNumber(current, config)}${unit || ''}`,
      hass,
      details: {
        heading: showLabels
          ? config?.label?.temperature ?? localize('ui.card.climate.currently')
          : false,
      },
    }),
    renderInfoItem({
      hide: _hide.state,
      state: stateString,
      hass,
      details: {
        heading: showLabels
          ? config?.label?.state ??
            localize('ui.panel.lovelace.editor.card.generic.state')
          : false,
      },
    }),
    ...sensors.map(({ name, state, ...rest }) => {
      return renderInfoItem({
        state,
        hass,
        localize,
        openEntityPopover,
        details: {
          ...rest,
          heading: showLabels && name,
        },
      })
    }),
  ].filter(Boolean)

  return wrapSensors(config, sensorHtml)
}
