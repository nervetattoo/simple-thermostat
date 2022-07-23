import { html, nothing } from 'lit-html'
import { LooseObject } from '../types'
import { HeaderData } from '../config/header'

type HeaderOptions = {
  header: false | HeaderData
  entity: LooseObject
  openEntityPopover
  toggleEntityChanged
}

export default function renderHeader({
  header,
  toggleEntityChanged,
  entity,
  openEntityPopover,
}: HeaderOptions) {
  if (header === false) {
    return nothing
  }

  const action = entity.attributes.hvac_action || entity.state
  let icon = header.icon
  if (typeof header.icon === 'object') {
    icon = icon?.[action] ?? false
  }

  const name = header?.name ?? false

  return html`
    <header>
      <div
        style="display: flex;"
        class="clickable"
        @click=${() => openEntityPopover()}
      >
        ${renderIcon(icon)} ${renderName(name)}
      </div>
      ${renderFaults(header.faults, openEntityPopover)}
      ${renderToggle(header.toggle, openEntityPopover, toggleEntityChanged)}
    </header>
  `
}

function renderIcon(icon) {
  return icon
    ? html` <ha-icon class="header__icon" .icon=${icon}></ha-icon> `
    : nothing
}

function renderName(name) {
  return name ? html`<h2 class="header__title">${name}</h2>` : nothing
}

function renderFaults(faults, openEntityPopover) {
  if (faults.length === 0) {
    return nothing
  }
  const faultHtml = faults.map(({ icon, hide_inactive, state }) => {
    return html` <ha-icon
      class="fault-icon ${state.state === 'on'
        ? 'active'
        : hide_inactive
        ? ' hide'
        : ''}"
      icon="${icon || state.attributes.icon}"
      @click="${() => openEntityPopover(state.entity_id)}"
    ></ha-icon>`
  })

  return html` <div class="faults">${faultHtml}</div>`
}

function renderToggle(toggle, openEntityPopover, toggleEntityChanged) {
  if (!toggle) return nothing

  return html`
    <div style="margin-left: auto;">
      <span
        class="clickable toggle-label"
        @click=${() => openEntityPopover(toggle.entity.entity_id)}
        >${toggle.label}
      </span>
      <ha-switch
        .checked=${toggle.entity?.state === 'on'}
        @change=${toggleEntityChanged}
      ></ha-switch>
    </div>
  `
}
