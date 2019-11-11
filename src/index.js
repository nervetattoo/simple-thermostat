import { LitElement, html } from 'lit-element'
import debounce from 'debounce-fn'

import styles from './styles'
import formatNumber from './formatNumber'
import getEntityType from './getEntityType'

const DEBOUNCE_TIMEOUT = 1000
const STEP_SIZE = 0.5
const DECIMALS = 1
const UPDATE_PROPS = ['entity', 'sensors', '_values', 'modes']

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

const modeIcons = {
  off: 'hass:power',
  auto: 'hass:autorenew',
  heat: 'hass:fire',
  heat_cool: 'hass:autorenew',
  cool: 'hass:snowflake',
  fan_only: 'hass:fan',
  dry: 'hass:water-percent',
}

// Preset mode can be  one of: none, eco, away, boost, comfort, home, sleep, activity
const presetModeIcons = {
  none: 'hass:power',
  eco: 'hass:leaf',
  away: 'mdi:radiator-disabled',
  boost: 'mdi:fire',
  home: 'hass:fire',
  comfort: 'hass:fire',
  sleep: 'hass:fire',
  activity: 'hass:fire',
}

const STATE_ICONS = {
  off: 'mdi:radiator-off',
  idle: 'mdi:radiator-disabled',
  heat: 'mdi:radiator',
  cool: 'mdi:snowflake',
  auto: 'mdi:radiator',
}

const DEFAULT_HIDE = {
  temperature: false,
  state: false,
  mode: false,
  preset: false,
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
    .filter(name => isIncluded(name, config))
    .map(name => {
      // Grab all values sans the possible include prop
      // and stuff it into an  object
      const { include, ...values } =
        typeof config[name] === 'object' ? config[name] : {}
      return {
        icon: modeIcons[name],
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
      sensors: Array,
      modes: Object,
      icon: String,
      _values: Object,
      _mode: String,
      _hide: Object,
      name: String,
    }
  }

  constructor() {
    super()

    this.i = 0

    this._debouncedSetTemperature = debounce(
      values => {
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
    this.icon = null
    this.sensors = []
    this._stepSize = STEP_SIZE
    this._values = {}
    this._hide = DEFAULT_HIDE
    this.modeOptions = {
      names: true,
      icons: true,
      headings: true,
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity')
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

    const attributes = entity.attributes

    this.entityType = getEntityType(attributes)
    if (this.entityType === 'dual') {
      this._values = {
        target_temp_low: attributes.target_temp_low,
        target_temp_high: attributes.target_temp_high,
      }
    } else {
      this._values = {
        temperature: attributes.temperature,
      }
    }

    const supportedModeType = type =>
      MODE_TYPES.includes(type) && attributes[`${type}_modes`]
    const buildBasicModes = items => {
      return items.filter(supportedModeType).map(type => ({
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

      this.modeOptions.names = _names
      this.modeOptions.icons = _icons
      this.modeOptions.headings = _headings

      const entries = Object.entries(modes)
      if (entries.length > 0) {
        controlModes = entries
          .filter(([type]) => supportedModeType(type))
          .map(([type, { _name, ...config }]) => {
            return {
              type,
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
    this.modes = controlModes.map(values => {
      if (values.type === 'hvac') {
        const sortedList = []
        values.list.forEach(item => {
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
      this.icon = STATE_ICONS
    }

    if (this.config.step_size) {
      this._stepSize = this.config.step_size
    }

    if (this.config.hide) {
      this._hide = { ...this._hide, ...this.config.hide }
    }

    if (typeof this.config.name === 'string') {
      this.name = this.config.name
    } else if (this.config.name === false) {
      this.name = false
    } else {
      this.name = entity.attributes.friendly_name
    }

    if (this.config.sensors) {
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
            name: name.find(n => !!n),
            state,
            entity,
          }
        }
      )
    }
  }

  shouldUpdate(changedProps) {
    return UPDATE_PROPS.some(prop => changedProps.has(prop))
  }

  localize(label, prefix = '') {
    const lang = this._hass.selectedLanguage || this._hass.language
    const key = `${prefix}${label}`
    const translations = this._hass.resources[lang]

    return key in translations ? translations[key] : label
  }

  render({ _hass, _hide, _values, config, entity, sensors } = this) {
    if (!entity) {
      return html`
        <ha-card class="not-found">
          Entity not available: <strong class="name">${config.entity}</strong>
        </ha-card>
      `
    }

    const {
      state,
      attributes: {
        min_temp: minTemp = null,
        max_temp: maxTemp = null,
        hvac_action: action,
        current_temperature: current,
        ...attributes
      },
    } = entity

    const unit = this._hass.config.unit_system.temperature

    const sensorHtml = [
      this.renderInfoItem(
        _hide.temperature,
        `${formatNumber(current, config)}${unit}`,
        { heading: 'Temperature' }
      ),
      this.renderInfoItem(
        _hide.state,
        this.localize(action, 'state_attributes.climate.hvac_action.'),
        { heading: 'State' }
      ),
      sensors.map(({ name, icon, state }) => {
        return (
          state && this.renderInfoItem(false, state, { heading: name, icon })
        )
      }) || null,
    ].filter(it => it !== null)

    return html`
      <ha-card class="${this.name ? '' : 'no-header'}">
        ${this.renderHeader()}
        <section class="body">
          <div class="sensors">
            ${sensorHtml}
          </div>

          ${Object.entries(_values).map(([field, value]) => {
            return html`
              <div class="main">
                <div class="current-wrapper">
                  <paper-icon-button
                    ?disabled=${maxTemp && value >= maxTemp}
                    class="thermostat-trigger"
                    icon="hass:chevron-up"
                    @click="${() => this.setTemperature(this._stepSize, field)}"
                  >
                  </paper-icon-button>

                  <div @click=${() => this.openEntityPopover()}>
                    <h3 class="current--value">
                      ${formatNumber(value, config)}
                    </h3>
                  </div>
                  <paper-icon-button
                    ?disabled=${minTemp && value <= minTemp}
                    class="thermostat-trigger"
                    icon="hass:chevron-down"
                    @click="${() =>
                      this.setTemperature(-this._stepSize, field)}"
                  >
                  </paper-icon-button>
                </div>
                <span class="current--unit">${unit}</span>
              </div>
            `
          })}
        </section>

        ${this.modes.map(mode => this.renderModeType(mode))}
      </ha-card>
    `
  }

  renderHeader() {
    if (this.name === false) return ''

    let icon = this.icon
    const { hvac_action: action } = this.entity.attributes
    if (typeof this.icon === 'object') {
      icon = action in this.icon ? this.icon[action] : false
    }

    return html`
      <header class="clickable" @click=${() => this.openEntityPopover()}>
        ${(icon &&
          html`
            <ha-icon class="header__icon" .icon=${icon}></ha-icon>
          `) ||
          ''}
        <h2 class="header__title">${this.name}</h2>
      </header>
    `
  }

  renderModeType({ type, mode = 'none', list, name }) {
    if (list.length === 0) {
      return null
    }

    let localizePrefix = `state_attributes.climate.${type}_mode.`
    if (type === 'hvac') {
      localizePrefix = `state.climate.`
    }

    const maybeRenderName = name => {
      if (name === false) return null
      if (this.modeOptions.names === false) return null
      return this.localize(name, localizePrefix)
    }
    const maybeRenderIcon = icon => {
      if (!icon) return null
      if (this.modeOptions.icons === false) return null
      return html`
        <ha-icon class="mode__icon" .icon=${icon}></ha-icon>
      `
    }

    const str = type == 'hvac' ? 'operation' : `${type}_mode`
    const title = name || this.localize(`ui.card.climate.${str}`)
    const { headings } = this.modeOptions

    return html`
      <div class="modes ${headings ? 'heading' : ''}">
        ${headings
          ? html`
              <div class="mode-title">${title}</div>
            `
          : null}
        ${list.map(
          ({ value, icon, name }) => html`
            <div
              class="mode-item ${value === mode ? 'active' : ''}"
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

  renderInfoItem(hide, state, { heading, icon }) {
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
          class="clickable"
          @click="${() => this.openEntityPopover(state.entity_id)}"
        >
          ${value} ${state.attributes.unit_of_measurement}
        </div>
      `
    } else {
      valueCell = html`
        <div>${state}</div>
      `
    }

    let headingCell
    if (icon) {
      heading = html`
        <ha-icon icon="${icon}"></ha-icon>
      `
    } else {
      heading = html`
        ${heading}:
      `
    }
    return html`
      <div class="sensor-heading">${heading}</div>
      ${valueCell}
    `
  }

  setTemperature(change, field = 'temperature') {
    this._values = {
      ...this._values,
      [field]: this._values[field] + change,
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
}

window.customElements.define('simple-thermostat', SimpleThermostat)

export default SimpleThermostat
