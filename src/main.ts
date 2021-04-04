import { LitElement, html, property } from 'lit-element'
import { nothing } from 'lit-html'
import debounce from 'debounce-fn'
import { name as CARD_NAME } from '../package.json'

import isEqual from './isEqual'
import styles from './styles.css'

import formatNumber from './formatNumber'
import fireEvent from './fireEvent'
import renderHeader from './components/header'
import renderSensors from './components/sensors'
import renderModeType from './components/modeType'

import parseHeader, { HeaderData, MODE_ICONS } from './config/header'
import parseSetpoints from './config/setpoints'
import parseService from './config/service'

import {
  CardConfig,
  ControlMode,
  ControlField,
  LooseObject,
  ConfigSensor,
  Sensor,
  HASS,
  HVAC_MODES,
  MODES,
  Service,
} from './types'

const DEBOUNCE_TIMEOUT = 1000
const STEP_SIZE = 0.5
const DECIMALS = 1

const MODE_TYPES: Array<string> = Object.values(MODES)

const DEFAULT_CONTROL = [MODES.HVAC, MODES.PRESET]

const ICONS = {
  UP: 'hass:chevron-up',
  DOWN: 'hass:chevron-down',
  PLUS: 'mdi:plus',
  MINUS: 'mdi:minus',
}

type ModeIcons = {
  [key: string]: string
}

const DEFAULT_HIDE = {
  temperature: false,
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

type Values = {
  [key: string]: number | string
}

export default class SimpleThermostat extends LitElement {
  static get styles() {
    return styles
  }

  @property()
  config: CardConfig
  @property()
  header: false | HeaderData
  @property()
  service: Service
  @property()
  modes: Array<ControlMode> = []
  @property()
  _hass: HASS = {}
  @property()
  entity: LooseObject = {}
  @property()
  sensors: Array<Sensor> = []
  @property()
  showSensors: boolean = true
  @property()
  name: string | false = ''
  _stepSize = STEP_SIZE
  @property()
  _values: Values
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
      const { domain, service, data = {} } = this.service
      this._hass.callService(domain, service, {
        entity_id: this.config.entity,
        ...data,
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

    this.header = parseHeader(this.config.header, entity, hass)
    this.service = parseService(this.config?.service ?? false)

    const attributes = entity.attributes

    let values = parseSetpoints(this.config?.setpoints ?? false, attributes)

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
      if (values.type === MODES.HVAC) {
        const sortedList: Array<any> = []
        const hvacModeValues = Object.values(HVAC_MODES)
        values.list.forEach((item: LooseObject) => {
          const index = hvacModeValues.indexOf(item.value)
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

    if (this.config.step_size) {
      this._stepSize = +this.config.step_size
    }

    if (this.config.hide) {
      this._hide = { ...this._hide, ...this.config.hide }
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
            names.push(state?.attributes?.friendly_name)
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
  }

  localize = (label: string, prefix = '') => {
    const lang = this._hass.selectedLanguage || this._hass.language
    const key = `${prefix}${label}`
    const translations = this._hass.resources[lang]

    return translations?.[key] ?? label
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

    const classes = [!this.header && 'no-header', action].filter((cx) => !!cx)
    return html`
      <ha-card class="${classes.join(' ')}">
        ${renderHeader({
          header: this.header,
          toggleEntityChanged: this.toggleEntityChanged,
          entity: this.entity,
          openEntityPopover: this.openEntityPopover,
        })}
        <section class="body">
          ${this.showSensors
            ? renderSensors({
                _hide: this._hide,
                unit,
                entity: this.entity,
                sensors: this.sensors,
                config: this.config,
                localize: this.localize,
                openEntityPopover: this.openEntityPopover,
              })
            : ''}
          ${Object.entries(_values).map(([field, value]) => {
            const hasValue = ['string', 'number'].includes(typeof value)
            const showUnit = unit !== false && hasValue
            return html`
              <div class="current-wrapper ${stepLayout}">
                <ha-icon-button
                  ?disabled=${maxTemp && value >= maxTemp}
                  class="thermostat-trigger"
                  icon=${row ? ICONS.PLUS : ICONS.UP}
                  @click="${() => this.setTemperature(this._stepSize, field)}"
                >
                </ha-icon-button>

                <h3
                  @click=${() => this.openEntityPopover()}
                  class="current--value ${_updatingValues
                    ? 'updating'
                    : nothing}"
                >
                  ${formatNumber(value, config)}
                  ${showUnit
                    ? html`<span class="current--unit">${unit}</span>`
                    : nothing}
                </h3>
                <ha-icon-button
                  ?disabled=${minTemp && value <= minTemp}
                  class="thermostat-trigger"
                  icon=${row ? ICONS.MINUS : ICONS.DOWN}
                  @click="${() => this.setTemperature(-this._stepSize, field)}"
                >
                </ha-icon-button>
              </div>
            `
          })}
        </section>

        ${this.modes.map((mode) =>
          renderModeType({
            state: entity.state,
            mode,
            localize: this.localize,
            modeOptions: this.modeOptions,
            setMode: this.setMode,
          })
        )}
      </ha-card>
    `
  }

  toggleEntityChanged(ev: Event) {
    if (!this.header) return
    const el = ev.target as HTMLInputElement
    const newVal = el.checked
    this._hass.callService('homeassistant', newVal ? 'turn_on' : 'turn_off', {
      entity_id: this.header?.toggle?.entity,
    })
  }

  setTemperature(change: number, field: string) {
    this._updatingValues = true
    const previousValue = this._values[field] as number
    const newValue = previousValue + change
    const { decimals } = this.config

    this._values[field] = +formatNumber(newValue, { decimals })
    this._debouncedSetTemperature(this._values)
  }

  setMode = (type: string, mode: string) => {
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

  openEntityPopover = (entityId = null) => {
    fireEvent(this, 'hass-more-info', {
      entityId: entityId || this.config.entity,
    })
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
