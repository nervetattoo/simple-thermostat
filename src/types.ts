import { HeaderConfig } from './config/header'

export interface LooseObject {
  [key: string]: any
}

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
