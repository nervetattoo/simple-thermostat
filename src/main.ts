import { LitElement, html, nothing, PropertyValues } from 'lit'
import { state } from 'lit/decorators.js'
import debounce from 'debounce-fn'
import { name as CARD_NAME } from '../package.json'

import isEqual from './isEqual'
import styles from './styles.css'

import formatNumber from './formatNumber'
import fireEvent from './fireEvent'
import renderHeader from './components/header'
import renderTemplated, { wrapSensors } from './components/templated'
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
  PreparedSensor,
  HASS,
  HVAC_MODES,
} from './types'

interface HANode extends Element {
  hass: any
}

const DEBOUNCE_TIMEOUT = 500
const STEP_SIZE = 0.5
const DECIMALS = 1
const UPDATING_TIMEOUT = 10000

const MODE_TYPES: Array<string> = Object.values(MODES)

const DEFAULT_CONTROL = [MODES.HVAC, MODES.PRESET]

const ICONS = {
  UP: 'hass:chevron-up',
  DOWN: 'hass:chevron-down',
  PLUS: 'mdi:plus',
  MINUS: 'mdi:minus',
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

interface Values {
  [key: string]: number | string
}

export default class SimpleThermostat extends LitElement {
  static get styles() {
    return styles
  }

  @state()
  config!: CardConfig
  @state()
  header!: false | HeaderData
  @state()
  service!: Service
  @state()
  modes: Array<ControlMode> = []
  _hass: HASS = {}
  @state()
  entity: LooseObject | undefined
  @state()
  sensors: Array<Sensor | PreparedSensor> = []
  @state()
  showSensors: boolean = true
  stepSize = STEP_SIZE
  @state()
  _values: Values = {}
  @state()
  _updatingValues: boolean = false
  @state()
  _hide = DEFAULT_HIDE

  _updatingValuesTimeout: ReturnType<typeof setTimeout> | null = null
  _needsRecompute = true

  _debouncedSetTemperature = debounce(
    (values: object) => {
      const { domain, service, data = {} } = this.service
      this._callAction(`${domain}.${service}`, {
        entity_id: this.config.entity,
        ...data,
        ...values,
      })
    },
    {
      wait: DEBOUNCE_TIMEOUT,
    }
  )

  _callAction(action: string, data: object) {
    if (this._hass.performAction) {
      this._hass.performAction({ action, data })
    } else {
      const [domain, service] = action.split('.')
      this._hass.callService(domain, service, data)
    }
  }

  static getConfigElement() {
    return window.document.createElement(`${CARD_NAME}-editor`)
  }

  static getStubConfig(hass: any) {
    const climateEntity = Object.keys(hass.states).find((id) =>
      id.startsWith('climate.')
    )
    return { entity: climateEntity ?? 'climate.my_thermostat' }
  }

  setConfig(config: CardConfig) {
    if (!config?.entity) {
      throw new Error('simple-thermostat: entity is required')
    }
    this.config = {
      decimals: DECIMALS,
      ...config,
    }
    this.service = parseService(this.config.service ?? false)
    this._needsRecompute = true
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this._updatingValuesTimeout) {
      clearTimeout(this._updatingValuesTimeout)
      this._updatingValuesTimeout = null
    }
    this._debouncedSetTemperature?.cancel?.()
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)
    const patchHass: Array<HANode> = Array.from(
      this.renderRoot.querySelectorAll('[with-hass]')
    )
    for (const child of Array.from(patchHass)) {
      // Forward attributes to properties
      Array.from(child.attributes).forEach((attr) => {
        if (attr.name.startsWith('fwd-')) {
          child[attr.name.replace('fwd-', '')] = attr.value
        }
      })
      // Always forward hass
      child.hass = this._hass
    }
  }

  set hass(hass: any) {
    if (!this.config?.entity || !hass?.states) {
      return
    }

    this._hass = hass
    const entity = hass.states[this.config.entity]

    // Reset entity when it disappears so render() shows the error state
    if (!entity) {
      if (this.entity !== undefined) this.entity = undefined
      return
    }

    // Short-circuit: skip full recompute when neither entity nor config changed.
    // entity objects in hass.states are replaced by reference on every HA update
    // for the specific entity that changed, so === is a reliable change check.
    if (this.entity === entity && !this._needsRecompute) {
      return
    }
    this._needsRecompute = false
    this.entity = entity

    this.header = parseHeader(this.config.header, entity, hass)

    const attributes = entity.attributes

    let values = parseSetpoints(this.config.setpoints, attributes)

    // If we are updating the values, and they are now equal
    // we can safely assume we've been able to update the set points
    // in HA and remove the updating flag
    // If we are not updating we take the values we get from HA
    // because it means they changed elsewhere
    if (this._updatingValues && isEqual(values, this._values)) {
      this._updatingValues = false
      if (this._updatingValuesTimeout) {
        clearTimeout(this._updatingValuesTimeout)
        this._updatingValuesTimeout = null
      }
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
        const hvacModeValues = Object.values(HVAC_MODES) as Array<string>
        const known: Array<ControlModeOption> = []
        const unknown: Array<ControlModeOption> = []
        values.list.forEach((item: ControlModeOption) => {
          const index = hvacModeValues.indexOf(item.value)
          if (index >= 0) {
            known[index] = item
          } else {
            unknown.push(item)
          }
        })
        return {
          ...values,
          list: [...known.filter(Boolean), ...unknown],
          mode: entity.state,
        } as ControlMode
      }
      const mode = attributes[`${values.type}_mode`]
      return { ...values, mode } as ControlMode
    })

    if (this.config.step_size) {
      this.stepSize = +this.config.step_size
    }

    this._hide = { ...DEFAULT_HIDE, ...this.config.hide }

    if (this.config.sensors === false) {
      this.showSensors = false
    } else if (this.config.version === 3) {
      this.sensors = []
      const configSensors = this.config.sensors ?? []
      const mainEntityId = this.config.entity!
      const customSensors = configSensors.map((sensor, index) => {
        const entityId = sensor?.entity ?? mainEntityId
        let context: LooseObject | undefined = entity
        if (sensor?.entity) {
          context = this._hass.states[sensor.entity]
        }
        return {
          id: sensor?.id ?? String(index),
          label: sensor?.label,
          template: sensor.template,
          show: sensor?.show !== false,
          entityId,
          context,
        } as PreparedSensor
      })
      const ids = customSensors.map((s) => s.id)
      const builtins = []
      if (!ids.includes('state')) {
        builtins.push({
          id: 'state',
          label: '{{ui.operation}}',
          template: '{{state.text}}',
          entityId: mainEntityId,
          context: entity,
        })
      }
      if (!ids.includes('temperature')) {
        builtins.push({
          id: 'temperature',
          label: '{{ui.currently}}',
          template: '{{current_temperature|formatNumber}}',
          entityId: mainEntityId,
          context: entity,
        })
      }
      this.sensors = [...builtins, ...customSensors]
    } else if (this.config.sensors) {
      this.sensors = this.config.sensors.map(
        ({ name, entity: sensorEntity, attribute, unit = '', ...rest }) => {
          let state
          const names = [name]
          if (sensorEntity) {
            state = hass.states[sensorEntity]
            names.push(state?.attributes?.friendly_name)
            if (attribute) {
              state = state?.attributes?.[attribute]
            }
          } else if (attribute && attribute in attributes) {
            state = attributes[attribute]
            names.push(attribute)
          }
          names.push(sensorEntity)

          return {
            ...rest,
            name: names.find((n) => !!n),
            state,
            entity: sensorEntity,
            unit,
          } as Sensor
        }
      )
    }
  }

  localize = (label: string, prefix = '') => {
    const key = `${prefix}${label}`
    return this._hass.localize(key) || label
  }

  render({ _hide, _values, _updatingValues, config, entity } = this) {
    const warnings = []
    if (this.stepSize < 1 && this.config.decimals === 0) {
      warnings.push(html`
        <ha-alert alert-type="warning">
          Decimals is set to 0 and step_size is lower than 1. Decrementing a
          setpoint will likely not work. Change one of the settings to clear
          this warning.
        </ha-alert>
      `)
    }

    if (!entity) {
      return html`
        <ha-alert alert-type="error">
          Entity not available: ${config.entity}
        </ha-alert>
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

    let sensorsHtml
    if (this.config.version === 3) {
      sensorsHtml = this.sensors
        .filter((spec: PreparedSensor) => spec.show !== false)
        .map((spec: PreparedSensor) => {
          return renderTemplated({
            ...spec,
            variables: this.config.variables,
            hass: this._hass,
            config: this.config,
            localize: this.localize,
            openEntityPopover: this.openEntityPopover,
          })
        })
      sensorsHtml = wrapSensors(this.config, sensorsHtml)
    } else {
      sensorsHtml = this.showSensors
        ? renderSensors({
            _hide,
            unit,
            hass: this._hass,
            entity: entity,
            sensors: this.sensors,
            config: this.config,
            localize: this.localize,
            openEntityPopover: this.openEntityPopover,
          })
        : ''
    }
    return html`
      <ha-card class="${classes.join(' ')}">
        ${this.config.styles
          ? html`<style>
              ${this.config.styles}
            </style>`
          : nothing}
        ${warnings}
        ${renderHeader({
          header: this.header,
          toggleEntityChanged: this.toggleEntityChanged,
          entity: entity,
          openEntityPopover: this.openEntityPopover,
        })}
        <section class="body">
          ${sensorsHtml}
          ${Object.entries(_values).map(([field, value]) => {
            const hasValue = ['string', 'number'].includes(typeof value)
            const showUnit = unit !== false && hasValue
            return html`
              <div class="current-wrapper ${stepLayout}">
                <ha-icon-button
                  ?disabled=${maxTemp !== null && value >= maxTemp}
                  class="thermostat-trigger"
                  aria-label="Increase ${field}"
                  .label=${`Increase ${field}`}
                  @click="${() => this.setTemperature(this.stepSize, field)}"
                >
                  <ha-icon .icon=${row ? ICONS.PLUS : ICONS.UP}></ha-icon>
                </ha-icon-button>

                <h3
                  @click=${() => this.openEntityPopover()}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      this.openEntityPopover()
                    }
                  }}
                  role="button"
                  tabindex="0"
                  aria-label=${`${field}: ${formatNumber(value, config)}${
                    showUnit ? ` ${unit}` : ''
                  }`}
                  class=${_updatingValues
                    ? 'current--value updating'
                    : 'current--value'}
                >
                  ${formatNumber(value, config)}
                  ${showUnit
                    ? html`<span class="current--unit">${unit}</span>`
                    : nothing}
                </h3>
                <ha-icon-button
                  ?disabled=${minTemp !== null && value <= minTemp}
                  class="thermostat-trigger"
                  aria-label="Decrease ${field}"
                  .label=${`Decrease ${field}`}
                  @click="${() => this.setTemperature(-this.stepSize, field)}"
                >
                  <ha-icon .icon=${row ? ICONS.MINUS : ICONS.DOWN}></ha-icon>
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
    if (!this.header?.toggle) return

    const el = ev.target as HTMLInputElement
    this._callAction(
      el.checked ? 'homeassistant.turn_on' : 'homeassistant.turn_off',
      { entity_id: this.header?.toggle?.entity?.entity_id }
    )
  }

  setTemperature(change: number, field: string) {
    this._updatingValues = true
    if (this._updatingValuesTimeout) clearTimeout(this._updatingValuesTimeout)
    this._updatingValuesTimeout = setTimeout(() => {
      this._updatingValues = false
      this._updatingValuesTimeout = null
    }, UPDATING_TIMEOUT)
    const previousValue = this._values[field]
    const newValue = Number(previousValue) + change
    const { decimals } = this.config

    this._values = {
      ...this._values,
      [field]: +formatNumber(newValue, { decimals }),
    }
    this._debouncedSetTemperature(this._values)
  }

  setMode = (type: string, mode: string) => {
    if (type && mode) {
      this._callAction(`climate.set_${type}_mode`, {
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

  getCardSize() {
    let size = 2 // temperature display + sensors row
    if (this.config?.header !== false) size += 1
    if (this.config?.control !== false) size += 1
    return size
  }

  getLayoutOptions() {
    const hasHeader = this.config?.header !== false
    const hasModes = this.config?.control !== false
    return {
      grid_columns: 2,
      grid_rows: (hasHeader ? 1 : 0) + 2 + (hasModes ? 1 : 0),
      grid_min_rows: 2,
      grid_max_rows: 5,
    }
  }

  getUnit(): string | boolean {
    if (this.config.unit !== undefined) {
      return this.config.unit
    }
    return this._hass.config?.unit_system?.temperature ?? false
  }
}
