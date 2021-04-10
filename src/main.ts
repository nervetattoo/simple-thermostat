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
import parseService, { Service } from './config/service'

import { CardConfig, ModeValue, ModeControlObject, MODES } from './config/card'

import {
  ControlMode,
  ControlModeOption,
  LooseObject,
  Sensor,
  HASS,
  HVAC_MODES,
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

interface ModeOptions {
  names?: boolean
  icons?: boolean
  headings?: boolean
}

const DEFAULT_HIDE = {
  temperature: false,
  state: false,
}

function shouldShowModeControl(
  modeOption: string,
  config: Partial<ModeControlObject>
) {
  if (typeof config[modeOption] === 'object') {
    const obj = config[modeOption] as ModeValue
    return obj.include !== false
  }

  return config?.[modeOption] ?? true
}

function getModeList(
  type: string,
  attributes: LooseObject,
  specification: Partial<ModeControlObject> = {}
) {
  return attributes[`${type}_modes`]
    .filter((modeOption) => shouldShowModeControl(modeOption, specification))
    .map((modeOption) => {
      const values =
        typeof specification[modeOption] === 'object'
          ? specification[modeOption]
          : ({} as {})
      return {
        icon: MODE_ICONS[modeOption],
        value: modeOption,
        name: modeOption,
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
  _updatingValues: boolean = false
  @property()
  _hide = DEFAULT_HIDE

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
    this.config = {
      decimals: DECIMALS,
      ...config,
    }
  }

  set hass(hass: any) {
    const entity = hass.states[this.config.entity]
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

    let values = parseSetpoints(this.config?.setpoints ?? null, attributes)

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
        hide_when_off: false,
        list: getModeList(type, attributes),
      }))
    }

    let controlModes: Array<Partial<ControlMode>> = []
    if (this.config.control === false) {
      controlModes = []
    } else if (Array.isArray(this.config.control)) {
      controlModes = buildBasicModes(this.config.control)
    } else if (typeof this.config.control === 'object') {
      const entries = Object.entries(this.config.control)
      if (entries.length > 0) {
        controlModes = entries
          .filter(([type]) => supportedModeType(type))
          .map(([type, definition]: [string, ModeControlObject]) => {
            const { _name, _hide_when_off, ...controlField } = definition
            return {
              type,
              hide_when_off: _hide_when_off,
              name: _name,
              list: getModeList(type, attributes, controlField),
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
        const sortedList: Array<Partial<ControlMode>> = []
        const hvacModeValues = Object.values(HVAC_MODES) as Array<string>
        values.list.forEach((item: ControlModeOption) => {
          const index = hvacModeValues.indexOf(item.value)
          sortedList[index] = item
        })
        return {
          ...values,
          list: sortedList,
          mode: entity.state,
        } as ControlMode
      }
      const mode = attributes[`${values.type}_mode`]
      return { ...values, mode } as ControlMode
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
        ({ name, entity, attribute, unit = '', ...rest }) => {
          let state
          const names = [name]
          if (entity) {
            state = hass.states[entity]
            names.push(state?.attributes?.friendly_name)
            if (attribute) {
              state = state.attributes[attribute]
            }
          } else if (attribute && attribute in this.entity.attributes) {
            state = this.entity.attributes[attribute]
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

    const stepLayout = this.config?.layout?.step ?? 'column'
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
                  ?disabled=${maxTemp !== null && value >= maxTemp}
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
                  ?disabled=${minTemp !== null && value <= minTemp}
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
            modeOptions: this.config?.layout?.mode ?? {},
            setMode: this.setMode,
          })
        )}
      </ha-card>
    `
  }

  toggleEntityChanged = (ev: Event) => {
    if (!this.header || !this?.header?.toggle) return

    const el = ev.target as HTMLInputElement
    this._hass.callService(
      'homeassistant',
      el.checked ? 'turn_on' : 'turn_off',
      {
        entity_id: this.header?.toggle?.entity?.entity_id,
      }
    )
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

  getUnit(): string | boolean {
    if (['boolean', 'string'].includes(typeof this.config.unit)) {
      return this.config?.unit
    }
    return this._hass.config?.unit_system?.temperature ?? false
  }
}
