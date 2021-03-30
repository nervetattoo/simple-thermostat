import { HeaderConfig } from './config/header'

export interface LooseObject {
  [key: string]: any
}

export interface SingleEntityValue {
  temperature: number
}
export interface DualEntityValue {
  target_temp_low: number
  target_temp_hight: number
}

export type EntityValue = SingleEntityValue | DualEntityValue

export interface Entity extends LooseObject {
  attributes: LooseObject
}

export interface ControlField {
  name: string
  icon: string
  _hide_when_off: boolean
  [key: string]: string | boolean
}

export interface ControlObject {
  _name: string
  [key: string]: boolean | string | ControlField
}

export type ControlList = Array<string>

export interface ConfigSensor {
  entity: string
  name?: string
  icon?: string
  attribute?: string
  unit?: string
}

export interface Sensor extends ConfigSensor {
  state: any
}

export interface Fault {
  entity: string
  icon?: string
  hide_inactive?: boolean
}

export interface CardConfig {
  entity?: string
  header: false | HeaderConfig
  control?: false | ControlObject | ControlList
  decimals?: number
  step_size?: number
  sensors?: false | Array<ConfigSensor>
  step_layout?: 'row' | 'column'
  unit?: boolean | string
  fallback?: string
  hide?: {
    setpoint?: boolean
    temperature?: boolean
    state?: boolean
  }
  label?: {
    temperature?: string
    state?: string
  }
}

export interface HAState {
  state: string | number
  entity_id: string
  attributes: LooseObject
  last_changed?: string
  last_updated?: string
}

export interface HASS {
  states?: LooseObject
  [key: string]: any
}

export interface ControlMode {
  type: string
  mode?: any
  name?: string | boolean
  hide_when_off?: boolean
  list: Array<LooseObject>
}

export interface HAEvent extends Event {
  detail?: string | LooseObject
}

export enum MODES {
  HVAC = 'hvac',
  FAN = 'fan',
  PRESET = 'preset',
  SWING = 'swing',
}

export enum HVAC_MODES {
  OFF = 'off',
  HEAT = 'heat',
  COOL = 'cool',
  HEAT_COOL = 'heat_cool',
  AUTO = 'auto',
  DRY = 'dry',
  FAN_ONLY = 'fan_only',
}
