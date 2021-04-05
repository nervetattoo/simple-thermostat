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
        ${(icon &&
          html` <ha-icon class="header__icon" .icon=${icon}></ha-icon> `) ||
        ''}
        ${name ? html`<h2 class="header__title">${name}</h2>` : nothing}
      </div>
      ${renderFaults({ faults: header.faults, openEntityPopover })}
      ${header.toggle
        ? renderToggle({
            toggle: header.toggle,
            openEntityPopover,
            toggleEntityChanged,
          })
        : ''}
    </header>
  `
}

type FaultsOptions = {
  faults
  openEntityPopover
}
function renderFaults({ faults, openEntityPopover }: FaultsOptions) {
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

type ToggleOptions = {
  openEntityPopover
  toggle
  toggleEntityChanged
}
function renderToggle({
  toggle,
  toggleEntityChanged,
  openEntityPopover,
}: ToggleOptions) {
  return html`
    <div style="margin-left: auto;">
      <span
        class="clickable toggle-label"
        @click="${() => openEntityPopover(toggle.entity)}"
        >${toggle.label}
      </span>
      <ha-switch
        .checked=${toggle.entity?.state === 'on'}
        @change=${toggleEntityChanged}
      ></ha-switch>
    </div>
  `
}
