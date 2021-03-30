import { LitElement, html, property } from 'lit-element'
import debounce from 'debounce-fn'
import { name as CARD_NAME } from '../package.json'

import isEqual from './isEqual'
import styles from './styles.css'

import formatNumber from './formatNumber'
import getEntityType from './getEntityType'
import fireEvent from './fireEvent'
import renderHeader from './components/header'
import renderInfoItem from './components/infoItem'

import {
  CardConfig,
  HAState,
  HAEvent,
  ControlMode,
  ControlField,
  LooseObject,
  ConfigSensor,
  Sensor,
  Fault,
  HASS,
  EntityValue,
} from './types'

const DUAL = 'dual'
const DEBOUNCE_TIMEOUT = 1000
const STEP_SIZE = 0.5
const DECIMALS = 1

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

type ModeIcons = {
  [key: string]: string
}

const MODE_ICONS: ModeIcons = {
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

function isIncluded(key: string, values: any) {
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

function getModeList(type: string, attributes: any, config: any = {}) {
  return attributes[`${type}_modes`]
    .filter((name: string) => isIncluded(name, config))
    .map((name: string) => {
      // Grab all values sans the possible include prop
      // and stuff it into an  object
      const { include, ...values } =
        typeof config[name] === 'object' ? config[name] : ({} as any)
      return {
        icon: MODE_ICONS[name],
        value: name,
        name,
        ...values,
      }
    })
}

export default class SimpleThermostat extends LitElement {
  static get styles() {
    return styles
  }

  @property()
  config: CardConfig = {}
  @property()
  modes: Array<ControlMode> = []
  @property()
  _hass: HASS = {}
  @property()
  entity: LooseObject = {}
  @property()
  toggle_entity: HAState | null = null
  @property()
  toggle_entity_label: any = null
  @property()
  entityType: any
  @property()
  icon: any = null
  @property()
  sensors: Array<Sensor> = []
  @property()
  showSensors: boolean = true
  @property()
  faults: Array<Fault> = []
  @property()
  show_header: boolean = true
  @property()
  name: string | false = ''
  _stepSize = STEP_SIZE
  @property()
  _values: EntityValue
  @property()
  _updatingValues = false
  @property()
  _hide = DEFAULT_HIDE
  @property()
  modeOptions = {
    names: true,
    icons: true,
    headings: true,
  }

  _debouncedSetTemperature = debounce(
    (values: object) => {
      this._hass.callService('climate', 'set_temperature', {
        entity_id: this.config.entity,
        ...values,
      })
    },
    {
      wait: DEBOUNCE_TIMEOUT,
    }
  )

  static getConfigElement() {
    return window.document.createElement(`${CARD_NAME}-editor`)
  }

  setConfig(config: CardConfig) {
    if (!config.entity) {
      throw new Error('You need to define an entity')
    }
    if (config.show_header === false && config.faults) {
      throw new Error('Faults are not supported when header is hidden')
    }
    this.config = <CardConfig>{
      decimals: DECIMALS,
      ...config,
    }
  }

  set hass(hass: any) {
    const entity = hass.states[this.config.entity as string]
    if (typeof entity === undefined) {
      return
    }

    this._hass = hass
    if (this.entity !== entity) {
      this.entity = entity
    }

    if (typeof this.config.toggle_entity === 'string') {
      const toggle_entity: HAState = hass.states[this.config.toggle_entity]
      if (this.toggle_entity !== toggle_entity) {
        this.toggle_entity = toggle_entity
      }
    } else if (typeof this.config.toggle_entity === 'object') {
      const toggle_entity: HAState =
        hass.states[this.config.toggle_entity.entity_id]

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

    const supportedModeType = (type: string) =>
      MODE_TYPES.includes(type) && attributes[`${type}_modes`]
    const buildBasicModes = (items: any) => {
      return items.filter(supportedModeType).map((type: string) => ({
        type,
        list: getModeList(type, attributes, {}),
      }))
    }

    let controlModes: Array<ControlMode> = []
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
          .map(([type, definition]) => {
            const {
              _name,
              _hide_when_off,
              ...config
            } = definition as ControlField
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
        const sortedList: Array<any> = []
        values.list.forEach((item: LooseObject) => {
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
      this.showSensors = false
    } else if (this.config.sensors) {
      this.sensors = this.config.sensors.map(
        ({ name, entity, attribute, unit = '', ...rest }: ConfigSensor) => {
          let state
          const names = [name]
          if (entity) {
            state = hass.states[entity]
            names.push(
              state && state.attributes && state.attributes.friendly_name
            )
            if (attribute) {
              state = state.attributes[attribute] + unit
            }
          } else if (attribute && attribute in this.entity.attributes) {
            state = this.entity.attributes[attribute] + unit
            names.push(attribute)
          }
          names.push(entity)

          return {
            ...rest,
            name: names.find((n) => !!n),
            state,
            entity,
            unit,
          } as Sensor
        }
      )
    }

    if (this.config.faults === false) {
      this.faults = []
    } else if (this.config.faults) {
      this.faults = this.config.faults.map(({ entity, ...rest }: Fault) => {
        return {
          ...rest,
          state: hass.states[entity],
          entity,
        }
      })
    }
  }

  localize(label: string, prefix = '') {
    const lang = this._hass.selectedLanguage || this._hass.language
    const key = `${prefix}${label}`
    const translations = this._hass.resources[lang]

    return key in translations ? translations[key] : label
  }

  render({ _hide, _values, _updatingValues, config, entity } = this) {
    if (!entity) {
      return html`
        <hui-warning> Entity not available: ${config.entity} </hui-warning>
      `
    }

    const {
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
        ${renderHeader({
          name: this.name,
          icon: this.icon,
          faults: this.faults,
          toggle_entity: this.toggle_entity,
          toggle_entity_label: this.toggle_entity_label,
          toggleEntityChanged: this.toggleEntityChanged,
          entity: this.entity,
          openEntityPopover: this.openEntityPopover,
        })}
        <section class="body">
          ${this.showSensors ? this.renderSensors() : ''}
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

  toggleEntityChanged(ev: Event) {
    const el = ev.target as HTMLInputElement
    const newVal = el.checked
    this._hass.callService('homeassistant', newVal ? 'turn_on' : 'turn_off', {
      entity_id: this.toggle_entity?.entity_id,
    })
  }

  renderSensors({ _hide, entity, sensors } = this) {
    const {
      attributes: { hvac_action: action, current_temperature: current },
    } = entity
    const unit = this.getUnit()

    const sensorHtml = [
      renderInfoItem({
        hide: _hide.temperature,
        state: `${formatNumber(current, this.config)}${unit}`,
        details: {
          heading: this?.config?.label?.temperature ?? 'Temperature',
        },
      }),
      renderInfoItem({
        hide: _hide.state,
        state: this.localize(action, 'state_attributes.climate.hvac_action.'),
        details: {
          heading: this?.config?.label?.state ?? 'State',
        },
      }),
      ...(sensors.map(({ name, icon, state, unit }) => {
        return (
          state &&
          renderInfoItem({
            hide: false,
            state,
            details: { heading: name, icon, unit },
          })
        )
      }) || null),
    ].filter((it) => it !== null)

    return html` <div class="sensors">${sensorHtml}</div> `
  }

  renderModeType(
    state: string,
    { type, hide_when_off, mode = 'none', list, name }: ControlMode
  ) {
    if (list.length === 0 || (hide_when_off && state === HVAC_MODES[0])) {
      return null
    }

    let localizePrefix = `state_attributes.climate.${type}_mode.`
    if (type === 'hvac') {
      localizePrefix = `state.climate.`
    }

    const maybeRenderName = (name: string | false) => {
      if (name === false) return null
      if (this.modeOptions.names === false) return null
      return this.localize(name, localizePrefix)
    }
    const maybeRenderIcon = (icon: string) => {
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

  setTemperature(change: number, field = 'temperature') {
    this._updatingValues = true
    this._values = {
      ...this._values,
      [field]: +formatNumber(this._values[field] + change, {
        decimals: this.config.decimals,
      }),
    }
    this._debouncedSetTemperature({
      ...this._values,
    })
  }

  setMode(type: string, mode: string) {
    if (type && mode) {
      this._hass.callService('climate', `set_${type}_mode`, {
        entity_id: this.config.entity,
        [`${type}_mode`]: mode,
      })
      fireEvent(this, 'haptic', 'light')
    } else {
      fireEvent(this, 'haptic', 'failure')
    }
  }

  openEntityPopover(entityId = this.config.entity) {
    fireEvent(this, 'hass-more-info', { entityId })
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3
  }

  getUnit(): string | boolean | undefined {
    if (['boolean', 'string'].includes(typeof this.config.unit)) {
      return this.config?.unit
    }
    return this._hass.config.unit_system.temperature
  }
}
