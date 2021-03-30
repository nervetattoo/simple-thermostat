import { html } from 'lit-element'
import { LooseObject } from '../types'

type HeaderOptions = {
  name: string | boolean
  icon: string | LooseObject
  faults
  toggle_entity
  entity: LooseObject
  openEntityPopover
  toggle_entity_label
  toggleEntityChanged
}

export default function renderHeader({
  name,
  icon,
  faults,
  toggle_entity,
  toggle_entity_label,
  toggleEntityChanged,
  entity,
  openEntityPopover,
}: HeaderOptions) {
  const action = entity.attributes.hvac_action || entity.state
  if (typeof icon === 'object') {
    icon = icon?.[action] ?? false
  }

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
        <h2 class="header__title">${name}</h2>
      </div>
      ${faults ? renderFaults({ faults, openEntityPopover }) : ''}
      ${toggle_entity
        ? renderToggle({
            openEntityPopover,
            toggle_entity,
            toggle_entity_label,
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
  toggle_entity
  toggle_entity_label
  toggleEntityChanged
}
function renderToggle({
  openEntityPopover,
  toggle_entity,
  toggle_entity_label,
  toggleEntityChanged,
}: ToggleOptions) {
  return html`
    <div style="margin-left: auto;">
      <span
        class="clickable toggle-label"
        @click="${() => openEntityPopover(toggle_entity?.entity_id)}"
        >${toggle_entity_label}
      </span>
      <ha-switch
        .checked=${toggle_entity?.state === 'on'}
        @change=${toggleEntityChanged}
      ></ha-switch>
    </div>
  `
}
