import { html } from 'lit'
import { ControlMode, HVAC_MODES } from '../types'

interface ModeTypeOptions {
  state: string
  mode: ControlMode
  modeOptions
  localize
  setMode
}

export default function renderModeType({
  state,
  mode: options,
  modeOptions,
  localize,
  setMode,
}: ModeTypeOptions) {
  const { type, hide_when_off, mode = 'none', list, name } = options
  if (list.length === 0 || (hide_when_off && state === HVAC_MODES.OFF)) {
    return null
  }

  const maybeRenderName = (name: string | false) => {
    if (name === false) return null
    if (modeOptions?.names === false) return null
    if (type === 'hvac') {
      return localize(name, 'component.climate.state._.')
    }
    return (
      localize(
        name,
        `component.climate.entity_component._.state_attributes.${type}_mode.state.`
      ) || localize(name, `state_attributes.climate.${type}_mode.`)
    )
  }
  const maybeRenderIcon = (icon: string) => {
    if (!icon) return null
    if (modeOptions?.icons === false) return null
    return html` <ha-icon class="mode-icon" .icon=${icon}></ha-icon> `
  }

  const str = type === 'hvac' ? 'operation' : `${type}_mode`
  const title = name || localize(`ui.card.climate.${str}`)
  const headings = modeOptions?.headings ?? true

  return html`
    <div class="modes ${headings ? 'heading' : ''}" role="group" aria-label=${title}>
      ${headings ? html` <div class="mode-title">${title}</div> ` : ''}
      ${list.map(
        ({ value, icon, name }) => html`
          <div
            class="mode-item ${value === mode ? 'active ' + mode : ''}"
            role="button"
            tabindex="0"
            aria-pressed=${value === mode ? 'true' : 'false'}
            aria-label=${name || value}
            @click=${() => setMode(type, value)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setMode(type, value)
              }
            }}
          >
            ${maybeRenderIcon(icon)} ${maybeRenderName(name)}
          </div>
        `
      )}
    </div>
  `
}
