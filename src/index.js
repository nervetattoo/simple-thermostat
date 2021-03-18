import { LitElement, html } from 'lit-element'
import debounce from 'debounce-fn'
import isEqual from 'lodash.isequal'
import { name, version } from '../package.json'

import styles from './styles.css'
import formatNumber from './formatNumber'
import getEntityType from './getEntityType'

import SimpleThermostatEditor from './editor'

const CARD_NAME = 'simple-thermostat'

customElements.define(`${CARD_NAME}-editor`, SimpleThermostatEditor)


function printVersion(version) {
  console.info(`%c${name}: ${version}`, 'font-weight: bold')
}

printVersion(version)

const DUAL = 'dual'
const SINGLE = 'single'
const DEBOUNCE_TIMEOUT = 1000
const STEP_SIZE = 0.5
const DECIMALS = 1
const UPDATE_PROPS = [
  'entity',
  'toggle_entity',
  'sensors',
  'faults',
  '_values',
  '_updatingValues',
  'modes',
]

const MODE_TYPES = ['hvac', 'fan', 'preset', 'swing']

// Sorted list of HVAC modes
const HVAC_MODES = [
  'off',
  'heat',
  'cool',
  'heat_cool',
  'auto',
  'dry',
  'fan_only',
]

const DEFAULT_CONTROL = ['hvac', 'preset']

const ICONS = {
  UP: 'hass:chevron-up',
  DOWN: 'hass:chevron-down',
  PLUS: 'mdi:plus',
  MINUS: 'mdi:minus',
}

const MODE_ICONS = {
  auto: 'hass:autorenew',
  cool: 'hass:snowflake',
  dry: 'hass:water-percent',
  fan_only: 'hass:fan',
  heat_cool: 'hass:autorenew',
  heat: 'hass:fire',
  off: 'hass:power',
}

const STATE_ICONS = {
  auto: 'mdi:radiator',
  cooling: 'mdi:snowflake',
  fan: 'mdi:fan',
  heating: 'mdi:radiator',
  idle: 'mdi:radiator-disabled',
  off: 'mdi:radiator-off',
}

const DEFAULT_HIDE = {
  temperature: false,
  setpoint: false,
  state: false,
}

function isIncluded(key, values) {
  if (typeof values === 'undefined') {
    return true
  }

  if (Array.isArray(values)) {
    return values.includes(key)
  }

  const type = typeof values[key]
  if (type === 'boolean') {
    return values[key]
  } else if (type === 'object') {
    return values[key].include !== false
  }

  return true
}

function getModeList(type, attributes, config = {}) {
  return attributes[`${type}_modes`]
    .filter((name) => isIncluded(name, config))
    .map((name) => {
      // Grab all values sans the possible include prop
      // and stuff it into an  object
      const { include, ...values } =
        typeof config[name] === 'object' ? config[name] : {}
      return {
        icon: MODE_ICONS[name],
        value: name,
        name,
        ...values,
      }
    })
}

class SimpleThermostat extends LitElement {
  static get styles() {
    return styles
  }

  static get properties() {
    return {
      i: Number,
      _hass: Object,
      config: Object,
      entity: Object,
      toggle_entity: Object,
      sensors: Array,
      faults: Array,
      modes: Object,
      icon: String,
      _values: Object,
      _updatingValues: Boolean,
      _mode: String,
      _hide: Object,
      name: String,
    }
  }

  constructor() {
    super()

    this._debouncedSetTemperature = debounce(
      (values) => {
        this._hass.callService('climate', 'set_temperature', {
          entity_id: this.config.entity,
          ...values,
        })
      },
      {
        wait: DEBOUNCE_TIMEOUT,
      }
    )

    this._hass = null
    this.entity = null
    this.toggle_entity = null
    this.toggle_entity_label = null
    this.icon = null
    this.sensors = []
    this.faults = []
    this._stepSize = STEP_SIZE
    this._values = {}
    this._updatingValues = false
    this._hide = DEFAULT_HIDE
    this.modeOptions = {
      names: true,
      icons: true,
      headings: true,
    }
  }

  static getConfigElement() {
    return window.document.createElement(`${CARD_NAME}-editor`)
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity')
    }
    if (config.show_header === false && config.faults) {
      throw new Error('Faults are not supported when header is hidden')
    }
    this.config = {
      decimals: DECIMALS,
      ...config,
    }
  }

  set hass(hass) {
    const entity = hass.states[this.config.entity]
    if (entity === undefined) {
      return
    }

    this._hass = hass
    if (this.entity !== entity) {
      this.entity = entity
    }

    if (typeof this.config.toggle_entity === 'string') {
      const toggle_entity = hass.states[this.config.toggle_entity]
      if (this.toggle_entity !== toggle_entity) {
        this.toggle_entity = toggle_entity
      }
    } else if (typeof this.config.toggle_entity === 'object') {
      const toggle_entity = hass.states[this.config.toggle_entity.entity_id]

      if (this.toggle_entity !== toggle_entity) {
        this.toggle_entity = toggle_entity
      }

      if (typeof this.config.toggle_entity.name === 'string') {
        this.toggle_entity_label = this.config.toggle_entity.name
      } else if (this.config.toggle_entity.name === true) {
        this.toggle_entity_label = this.toggle_entity.attributes.name
      } else {
        this.toggle_entity_label = undefined
      }
    }

    const attributes = entity.attributes

    this.entityType = getEntityType(attributes)
    let values
    if (this.entityType === DUAL) {
      values = {
        target_temp_low: attributes.target_temp_low,
        target_temp_high: attributes.target_temp_high,
      }
    } else {
      values = {
        temperature: attributes.temperature,
      }
    }

    // If we are updating the values, and they are now equal
    // we can safely assume we've been able to update the set points
    // in HA and remove the updating flag
    // If we are not updating we take the values we get from HA
    // because it means they changed elsewhere
    if (this._updatingValues && isEqual(values, this._values)) {
      this._updatingValues = false
    } else if (!this._updatingValues) {
      this._values = values
    }

    const supportedModeType = (type) =>
      MODE_TYPES.includes(type) && attributes[`${type}_modes`]
    const buildBasicModes = (items) => {
      return items.filter(supportedModeType).map((type) => ({
        type,
        list: getModeList(type, attributes, {}),
      }))
    }

    let controlModes = []
    if (this.config.control === false) {
      controlModes = []
    } else if (Array.isArray(this.config.control)) {
      controlModes = buildBasicModes(this.config.control)
    } else if (typeof this.config.control === 'object') {
      const { _names, _icons, _headings, ...modes } = this.config.control

      if (typeof _names === 'boolean') {
        this.modeOptions.names = _names
      }
      if (typeof _icons === 'boolean') {
        this.modeOptions.icons = _icons
      }
      if (typeof _headings === 'boolean') {
        this.modeOptions.headings = _headings
      }

      const entries = Object.entries(modes)
      if (entries.length > 0) {
        controlModes = entries
          .filter(([type]) => supportedModeType(type))
          .map(([type, { _name, _hide_when_off, ...config }]) => {
            return {
              type,
              hide_when_off: _hide_when_off,
              name: _name,
              list: getModeList(type, attributes, config),
            }
          })
      } else {
        controlModes = buildBasicModes(DEFAULT_CONTROL)
      }
    } else {
      controlModes = buildBasicModes(DEFAULT_CONTROL)
    }

    // Decorate mode types with active value and set to this.modes
    this.modes = controlModes.map((values) => {
      if (values.type === 'hvac') {
        const sortedList = []
        values.list.forEach((item) => {
          const index = HVAC_MODES.indexOf(item.value)
          sortedList[index] = item
        })
        return {
          ...values,
          list: sortedList,
          mode: entity.state,
        }
      }
      const mode = attributes[`${values.type}_mode`]
      return { ...values, mode }
    })

    if (typeof this.config.icon !== 'undefined') {
      this.icon = this.config.icon
    } else {
      if (this.entity.attributes.hvac_action) {
        this.icon = STATE_ICONS
      } else {
        this.icon = MODE_ICONS
      }
    }

    if (this.config.step_size) {
      this._stepSize = +this.config.step_size
    }

    if (this.config.hide) {
      this._hide = { ...this._hide, ...this.config.hide }
    }

    if (this.config.show_header === false) {
      this.show_header = false
    } else {
      this.show_header = true
    }

    if (typeof this.config.name === 'string') {
      this.name = this.config.name
    } else if (this.config.name === false) {
      this.name = false
    } else {
      this.name = entity.attributes.friendly_name
    }

    if (this.config.sensors === false) {
      this.sensors = false
    } else if (this.config.sensors) {
      this.sensors = this.config.sensors.map(
        ({ name: wantedName, entity, attribute, unit = '', ...rest }) => {
          let state
          const name = [wantedName]
          if (entity) {
            state = hass.states[entity]
            name.push(
              state && state.attributes && state.attributes.friendly_name
            )
            if (attribute) {
              state = state.attributes[attribute] + unit
            }
          } else if (attribute && attribute in this.entity.attributes) {
            state = this.entity.attributes[attribute] + unit
            name.push(attribute)
          }
          name.push(entity)

          return {
            ...rest,
            name: name.find((n) => !!n),
            state,
            entity,
            unit,
          }
        }
      )
    }

    if (this.config.faults === false) {
      this.faults = false
    } else if (this.config.faults) {
      this.faults = this.config.faults.map(({ entity, ...rest }) => {
        return {
          ...rest,
          state: hass.states[entity],
          entity,
        }
      })
    }
  }

  shouldUpdate(changedProps) {
    return UPDATE_PROPS.some((prop) => changedProps.has(prop))
  }

  localize(label, prefix = '') {
    const lang = this._hass.selectedLanguage || this._hass.language
    const key = `${prefix}${label}`
    const translations = this._hass.resources[lang]

    return key in translations ? translations[key] : label
  }

  render(
    {
      _hass,
      _hide,
      _values,
      _updatingValues,
      config,
      entity,
      sensors,
      faults,
    } = this
  ) {
    if (!entity) {
      return html`
        <hui-warning> Entity not available: ${config.entity} </hui-warning>
      `
    }

    const {
      state,
      attributes: {
        min_temp: minTemp = null,
        max_temp: maxTemp = null,
        hvac_action: action,
      },
    } = entity

    const unit = this.getUnit()

    const stepLayout = this.config.step_layout || 'column'
    const row = stepLayout === 'row'

    const classes = [!this.show_header && 'no-header', action].filter(
      (cx) => !!cx
    )
    return html`
      <ha-card class="${classes.join(' ')}">
        ${this.renderHeader()}
        <section class="body">
          ${this.sensors !== false ? this.renderSensors() : ''}
          ${_hide.setpoint
            ? ''
            : Object.entries(_values).map(([field, value]) => {
                return html`
                  <div class="current-wrapper ${stepLayout}">
                    <ha-icon-button
                      ?disabled=${maxTemp && value >= maxTemp}
                      class="thermostat-trigger"
                      icon=${row ? ICONS.PLUS : ICONS.UP}
                      @click="${() =>
                        this.setTemperature(this._stepSize, field)}"
                    >
                    </ha-icon-button>

                    <h3
                      @click=${() => this.openEntityPopover()}
                      class="current--value ${_updatingValues
                        ? 'updating'
                        : ''}"
                    >
                      ${formatNumber(value, config)}
                      ${unit !== false
                        ? html` <span class="current--unit">${unit}</span> `
                        : ''}
                    </h3>
                    <ha-icon-button
                      ?disabled=${minTemp && value <= minTemp}
                      class="thermostat-trigger"
                      icon=${row ? ICONS.MINUS : ICONS.DOWN}
                      @click="${() =>
                        this.setTemperature(-this._stepSize, field)}"
                    >
                    </ha-icon-button>
                  </div>
                `
              })}
        </section>

        ${this.modes.map((mode) => this.renderModeType(entity.state, mode))}
      </ha-card>
    `
  }

  renderHeader() {
    if (this.show_header === false || this.name === false) return ''

    let icon = this.icon
    const action = this.entity.attributes.hvac_action || this.entity.state
    if (typeof this.icon === 'object') {
      icon = action in this.icon ? this.icon[action] : false
    }

    return html`
      <header>
        <div
          style="display: flex;"
          class="clickable"
          @click=${() => this.openEntityPopover()}
        >
          ${(icon &&
            html` <ha-icon class="header__icon" .icon=${icon}></ha-icon> `) ||
          ''}
          <h2 class="header__title">${this.name}</h2>
        </div>
        ${this.faults !== false ? this.renderFaults() : ''}
        ${this.toggle_entity ? this.renderToggle() : ''}
      </header>
    `
  }

  toggleEntityChanged(ev) {
    const newVal = ev.target.checked
    this._hass.callService('homeassistant', newVal ? 'turn_on' : 'turn_off', {
      entity_id: this.toggle_entity.entity_id,
    })
  }

  renderSensors({ _hide, entity, sensors } = this) {
    const {
      state,
      attributes: { hvac_action: action, current_temperature: current },
    } = entity
    const unit = this.getUnit()

    const sensorHtml = [
      this.renderInfoItem(
        _hide.temperature,
        `${formatNumber(current, this.config)}${unit}`,
        {
          heading:
            (this.config.label && this.config.label.temperature) ||
            'Temperature',
        }
      ),
      this.renderInfoItem(
        _hide.state,
        this.localize(action, 'state_attributes.climate.hvac_action.'),
        { heading: (this.config.label && this.config.label.state) || 'State' }
      ),
      sensors.map(({ name, icon, state, unit }) => {
        return (
          state &&
          this.renderInfoItem(false, state, { heading: name, icon, unit })
        )
      }) || null,
    ].filter((it) => it !== null)

    return html` <div class="sensors">${sensorHtml}</div> `
  }

  renderToggle({ _hide, entity, faults } = this) {
    return html`
      <div style="margin-left: auto;">
        <span
          class="clickable toggle-label"
          @click="${() => this.openEntityPopover(this.toggle_entity.entity_id)}"
          >${this.toggle_entity_label}
        </span>
        <ha-switch
          .checked=${this.toggle_entity.state === 'on'}
          @change=${this.toggleEntityChanged}
        ></ha-switch>
      </div>
    `
  }

  renderFaults({ _hide, entity, faults } = this) {
    const faultHtml = faults.map(({ icon, hide_inactive, state }) => {
      return html` <ha-icon
        class="fault-icon ${state.state === 'on'
          ? 'active'
          : hide_inactive
          ? ' hide'
          : ''}"
        icon="${icon || state.attributes.icon}"
        @click="${() => this.openEntityPopover(state.entity_id)}"
      ></ha-icon>`
    })

    return html` <div class="faults">${faultHtml}</div>`
  }

  renderModeType(state, { type, hide_when_off, mode = 'none', list, name }) {
    if (list.length === 0 || (hide_when_off && state === HVAC_MODES[0])) {
      return null
    }

    let localizePrefix = `state_attributes.climate.${type}_mode.`
    if (type === 'hvac') {
      localizePrefix = `state.climate.`
    }

    const maybeRenderName = (name) => {
      if (name === false) return null
      if (this.modeOptions.names === false) return null
      return this.localize(name, localizePrefix)
    }
    const maybeRenderIcon = (icon) => {
      if (!icon) return null
      if (this.modeOptions.icons === false) return null
      return html` <ha-icon class="mode-icon" .icon=${icon}></ha-icon> `
    }

    const str = type == 'hvac' ? 'operation' : `${type}_mode`
    const title = name || this.localize(`ui.card.climate.${str}`)
    const { headings } = this.modeOptions

    return html`
      <div class="modes ${headings ? 'heading' : ''}">
        ${headings ? html` <div class="mode-title">${title}</div> ` : null}
        ${list.map(
          ({ value, icon, name }) => html`
            <div
              class="mode-item ${value === mode ? 'active ' + mode : ''}"
              @click=${() => this.setMode(type, value)}
            >
              ${maybeRenderIcon(icon)} ${maybeRenderName(name)}
            </div>
          `
        )}
      </div>
    `
  }

  // Preset mode can be  one of: none, eco, away, boost, comfort, home, sleep, activity
  // See https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/components/climate/const.py#L36-L57

  renderInfoItem(hide, state, { heading, icon, unit }) {
    if (hide || !state) return

    let valueCell
    if (typeof state === 'object') {
      let value = state.state
      if ('device_class' in state.attributes) {
        const [type] = state.entity_id.split('.')
        const prefix = ['state', type, state.attributes.device_class, ''].join(
          '.'
        )
        value = this.localize(state.state, prefix)
      }
      valueCell = html`
        <div
          class="sensor-value clickable"
          @click="${() => this.openEntityPopover(state.entity_id)}"
        >
          ${value} ${unit || state.attributes.unit_of_measurement}
        </div>
      `
    } else {
      valueCell = html` <div class="sensor-value">${state}</div> `
    }

    let headingCell
    if (icon) {
      heading = html` <ha-icon icon="${icon}"></ha-icon> `
    } else {
      heading = html` ${heading}: `
    }
    return html`
      <div class="sensor-heading">${heading}</div>
      ${valueCell}
    `
  }

  setTemperature(change, field = 'temperature') {
    this._updatingValues = true
    this._values = {
      ...this._values,
      [field]: +formatNumber(
        this._values[field] + change,
        this.config.decimals
      ),
    }
    this._debouncedSetTemperature({
      ...this._values,
    })
  }

  setMode(type, mode) {
    if (type && mode) {
      this._hass.callService('climate', `set_${type}_mode`, {
        entity_id: this.config.entity,
        [`${type}_mode`]: mode,
      })
      this.fire('haptic', 'light')
    } else {
      this.fire('haptic', 'failure')
    }
  }

  openEntityPopover(entityId = this.config.entity) {
    this.fire('hass-more-info', { entityId })
  }

  fire(type, detail, options) {
    options = options || {}
    detail = detail === null || detail === undefined ? {} : detail
    const e = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed,
    })
    e.detail = detail
    this.dispatchEvent(e)
    return e
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3
  }

  getUnit() {
    if (['boolean', 'string'].includes(typeof this.config.unit)) {
      return this.config.unit
    }
    return this._hass.config.unit_system.temperature
  }
}

window.customElements.define(CARD_NAME, SimpleThermostat)

export default SimpleThermostat

// Configures the preview in the Lovelace card picker
window.customCards = window.customCards || []
window.customCards.push({
  type: CARD_NAME,
  name: 'Simple Thermostat',
  preview: false,
  description: 'A different take on the thermostat card',
})
