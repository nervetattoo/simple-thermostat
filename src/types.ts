import { HeaderConfig } from './config/header'

export interface LooseObject {
  [key: string]: any
}

export interface ControlField {
  _name: string
  _hide_when_off: boolean
  icon: string
  [key: string]:
    | string
    | boolean
    | {
        name: string | boolean
        icon: string | boolean
      }
}

export interface ControlObject {
  _names?: boolean
  _icons?: boolean
  _headings?: boolean
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

export interface Setpoint {
  hide?: boolean
}

export type Setpoints = Record<string, Setpoint>

export interface Service {
  domain: string
  service: string
  data?: {
    [key: string]: string
  }
}

export interface CardConfig {
  entity?: string
  header: false | HeaderConfig
  control?: false | ControlObject | ControlList
  sensors?: false | Array<ConfigSensor>
  setpoints?: Setpoints
  decimals?: number
  step_size?: number
  step_layout?: 'row' | 'column'
  layout?: {
    sensors: {
      type: 'table'
    }
    step: 'row' | 'column'
  }
  unit?: boolean | string
  fallback?: string
  service?: Service
  hide?: {
    temperature?: boolean
    state?: boolean
  }
  label?: {
    temperature?: string
    state?: string
  }
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
