import { html } from 'lit-html'
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

  let localizePrefix = `state_attributes.climate.${type}_mode.`
  if (type === 'hvac') {
    localizePrefix = `state.climate.`
  }

  const maybeRenderName = (name: string | false) => {
    if (name === false) return null
    if (modeOptions.names === false) return null
    return localize(name, localizePrefix)
  }
  const maybeRenderIcon = (icon: string) => {
    if (!icon) return null
    if (modeOptions.icons === false) return null
    return html` <ha-icon class="mode-icon" .icon=${icon}></ha-icon> `
  }

  const str = type == 'hvac' ? 'operation' : `${type}_mode`
  const title = name || localize(`ui.card.climate.${str}`)
  const { headings } = modeOptions

  return html`
    <div class="modes ${headings ? 'heading' : ''}">
      ${headings ? html` <div class="mode-title">${title}</div> ` : null}
      ${list.map(
        ({ value, icon, name }) => html`
          <div
            class="mode-item ${value === mode ? 'active ' + mode : ''}"
            @click=${() => setMode(type, value)}
          >
            ${maybeRenderIcon(icon)} ${maybeRenderName(name)}
          </div>
        `
      )}
    </div>
  `
}
