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
    state,
    attributes: { hvac_action: action, current_temperature: current },
  } = entity

  const { type, labels: showLabels } = config?.layout?.sensors ?? {
    type: 'table',
    labels: true,
  }
  const stateString = [
    localize(action, 'state_attributes.climate.hvac_action.'),
    ' (',
    localize(state, 'component.climate.state._.'),
    ')',
  ].join('')
  const sensorHtml = [
    renderInfoItem({
      hide: _hide.temperature,
      state: `${formatNumber(current, config)}${unit || ''}`,
      details: {
        heading: showLabels
          ? config?.label?.temperature ?? localize('ui.card.climate.currently')
          : false,
      },
    }),
    renderInfoItem({
      hide: _hide.state,
      state: stateString,
      details: {
        heading: showLabels
          ? config?.label?.state ??
            localize('ui.panel.lovelace.editor.card.generic.state')
          : false,
      },
    }),
    ...(sensors.map(({ name, state, ...rest }) => {
      return (
        state &&
        renderInfoItem({
          hide: false,
          state,
          localize,
          openEntityPopover,
          details: {
            ...rest,
            heading: showLabels && name,
          },
        })
      )
    }) || null),
  ].filter((it) => it !== null)

  const classes = [
    showLabels ? 'with-labels' : 'without-labels',
    type === 'list' ? 'as-list' : 'as-table',
  ]
  return html` <div class="sensors ${classes.join(' ')}">${sensorHtml}</div> `
}
