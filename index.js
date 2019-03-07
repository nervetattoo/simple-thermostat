import { LitElement, html } from 'lit-element'
import { Debouncer } from '@polymer/polymer/lib/utils/debounce'

import { renderStyles, renderNotFoundStyles } from './src/styles'

function formatNumber(number) {
  const [int, dec] = String(number).split('.')
  return `${int}.${dec || '0'}`
}

const DEBOUNCE_TIMEOUT = 1000
const STEP_SIZE = 0.5
const UPDATE_PROPS = ['entity', 'sensors', '_temperature']
const modeIcons = {
  auto: 'hass:autorenew',
  manual: 'hass:cursor-pointer',
  heat: 'hass:fire',
  cool: 'hass:snowflake',
  off: 'hass:power',
  fan_only: 'hass:fan',
  eco: 'hass:leaf',
  dry: 'hass:water-percent',
  idle: 'hass:power',
}

const STATE_ICONS = {
  off: 'mdi:radiator-off',
  on: 'mdi:radiator',
  idle: 'mdi:radiator-disabled',
  heat: 'mdi:radiator',
  cool: 'mdi:snowflake',
  auto: 'mdi:radiator',
  manual: 'mdi:radiator',
  boost: 'mdi:fire',
  away: 'mdi:radiator-disabled',
}

const DEFAULT_HIDE = {
  temperature: false,
  state: false,
  mode: false,
  away: true,
}

class SimpleThermostat extends LitElement {
  static get properties() {
    return {
      _hass: Object,
      config: Object,
      entity: Object,
      sensors: Array,
      modes: Object,
      icon: String,
      _temperature: {
        type: Number,
        notify: true,
      },
      _mode: String,
      _hide: Object,
      name: String,
    }
  }

  constructor() {
    super()

    this._hass = null
    this.entity = null
    this.icon = null
    this.sensors = []
    this._stepSize = STEP_SIZE
    this._temperature = null
    this._mode = null
    this._hide = DEFAULT_HIDE
    this._haVersion = null
  }

  set hass(hass) {
    this._hass = hass

    const entity = hass.states[this.config.entity]
    if (entity === undefined) {
      return
    }

    this._haVersion = hass.config.version.split('.').map(i => parseInt(i, 10))

    if (this.entity !== entity) {
      this.entity = entity

      const {
        attributes: {
          operation_mode: mode,
          operation_list: modes = [],
          temperature: _temperature,
        },
      } = entity
      this._temperature = _temperature
      this._mode = mode

      this.modes = {}
      for (const mode of modes) {
        this.modes[mode] = {
          include: true,
          icon: modeIcons[mode],
        }
      }
    }

    if (this.config.modes === false) {
      this.modes = false
    } else if (typeof this.config.modes === 'object') {
      Object.entries(this.config.modes).map(([mode, config]) => {
        if (!this.modes.hasOwnProperty(mode)) {
          // Ignore modes that dont exist as reported by the entity
          return
        }
        if (typeof config === 'boolean') {
          this.modes[mode].include = config
        } else {
          this.modes[mode] = {
            ...this.modes[mode],
            ...config,
          }
        }
      })
    }

    if (this.config.icon) {
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
        ({ name: wantedName, entity, attribute }) => {
          let state
          const name = [wantedName]
          if (entity) {
            state = hass.states[entity]
            name.push(
              state && state.attributes && state.attributes.friendly_name
            )
          } else if (attribute && attribute in this.entity.attributes) {
            state = this.entity.attributes[attribute]
            name.push(attribute)
          }
          name.push(entity)

          return {
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

  render({ _hass, _hide, config, entity, sensors } = this) {
    if (!entity) {
      return html`
        ${renderNotFoundStyles()}
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
        current_temperature: current,
        operation_mode: activeMode,
        ...attributes
      },
    } = entity
    const unit = this._hass.config.unit_system.temperature

    const sensorHtml = [
      _hide.temperature
        ? null
        : this.renderInfoItem(`${formatNumber(current)}${unit}`, 'Temperature'),
      _hide.state
        ? null
        : this.renderInfoItem(this.localize(state, 'state.climate.'), 'State'),
      _hide.away ? null : this.renderAwayToggle(attributes.away_mode),
      sensors.map(({ name, state }) => {
        return state && this.renderInfoItem(state, name)
      }) || null,
    ].filter(it => it !== null)

    const increaseTemperature = this.handleTemperatureChange.bind(
      this,
      +this._stepSize
    )
    const decreaseTemperature = this.handleTemperatureChange.bind(
      this,
      -this._stepSize
    )
    return html`
      ${renderStyles()}
      <ha-card class="${this.name ? '' : 'no-header'}">
        ${this.renderHeader()}
        <section class="body">
          <table class="sensors">
            ${sensorHtml}
          </table>

          <div class="main">
            <div class="current-wrapper">
              <paper-icon-button
                ?disabled=${maxTemp && this._temperature >= maxTemp}
                class="thermostat-trigger"
                icon="hass:chevron-up"
                @click="${increaseTemperature}"
              >
              </paper-icon-button>

              <div
                class="current"
                @click="${() => this.openEntityPopover(config.entity)}"
              >
                <h3 class="current--value">
                  ${formatNumber(this._temperature)}
                </h3>
              </div>
              <paper-icon-button
                ?disabled=${minTemp && this._temperature <= minTemp}
                class="thermostat-trigger"
                icon="hass:chevron-down"
                @click="${decreaseTemperature}"
              >
              </paper-icon-button>
            </div>
            <span class="current--unit">${unit}</span>
          </div>
        </section>
        ${this.renderModeSelector(activeMode)}
      </ha-card>
    `
  }

  renderHeader() {
    if (this.name === false) return ''

    let icon = this.icon
    const { state } = this.entity
    if (typeof this.icon === 'object') {
      icon = state in this.icon ? this.icon[state] : false
    }

    return html`
      <header>
        ${(icon &&
          html`
            <ha-icon class="header__icon" .icon=${icon}></ha-icon>
          `) ||
          ''}
        <h2 class="header__title">${this.name}</h2>
      </header>
    `
  }

  renderModeSelector(currentMode) {
    if (this.modes === false) {
      return
    }

    console.log(this.modes)
    const entries = Object.entries(this.modes).filter(
      ([mode, config]) => config.include
    )
    console.log(entries)
    if (this._haVersion[1] <= 87) {
      return html`
        <div class="modes">
          ${entries.map(
            ([mode, config]) => html`
              <paper-button
                class="${mode === currentMode ? 'mode--active' : ''}"
                @click=${() => this.setMode(mode)}
              >
                <ha-icon class="mode__icon" .icon=${config.icon}></ha-icon>
                ${this.localize(mode, 'state.climate.')}
              </paper-button>
            `
          )}
        </div>
      `
    }
    return html`
      <div class="modes">
        ${entries.map(
          ([mode, config]) => html`
            <mwc-button
              ?disabled=${mode === currentMode}
              ?outlined=${mode === currentMode}
              ?dense=${true}
              @click=${() => this.setMode(mode)}
            >
              <ha-icon class="mode__icon" .icon=${config.icon}></ha-icon>
              ${this.localize(mode, 'state.climate.')}
            </mwc-button>
          `
        )}
      </div>
    `
  }

  renderAwayToggle(state) {
    return html`
      <tr>
        <th>${this.localize('ui.card.climate.away_mode')}</th>
        <td>
          <paper-toggle-button
            ?checked=${state === 'on'}
            @click=${() => {
              this._hass.callService('climate', 'set_away_mode', {
                entity_id: this.config.entity,
                away_mode: !(state === 'on'),
              })
            }}
          />
        </td>
      </tr>
    `
  }

  renderInfoItem(state, heading) {
    if (!state) return

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
        <td
          class="clickable"
          @click="${() => this.openEntityPopover(state.entity_id)}"
        >
          ${value} ${state.attributes.unit_of_measurement}
        </td>
      `
    } else {
      valueCell = html`
        <td>${state}</td>
      `
    }
    return html`
      <tr>
        <th>${heading}:</th>
        ${valueCell}
      </tr>
    `
  }

  handleTemperatureChange(change, e) {
    e.stopPropagation()
    this.setTemperature(this._temperature + change)
  }

  setTemperature(temperature) {
    this._debouncedSetTemperature = Debouncer.debounce(
      this._debouncedSetTemperature,
      {
        run: fn => {
          this._temperature = temperature
          return window.setTimeout(fn, DEBOUNCE_TIMEOUT)
        },
        cancel: handle => window.clearTimeout(handle),
      },
      () => {
        this._hass.callService('climate', 'set_temperature', {
          entity_id: this.config.entity,
          temperature: this._temperature,
        })
      }
    )
  }

  setMode(mode) {
    if (mode && mode !== this._mode) {
      this._hass.callService('climate', 'set_operation_mode', {
        entity_id: this.config.entity,
        operation_mode: mode,
      })
    }
  }

  openEntityPopover(entityId) {
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

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity')
    }
    this.config = config
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3
  }
}

window.customElements.define('simple-thermostat', SimpleThermostat)

export default SimpleThermostat
