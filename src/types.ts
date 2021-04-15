import { HeaderConfig } from './config/header'

export type LooseObject = Record<string, any>

export interface ConfigSensor {
  entity: string
  id?: string
  name?: string
  icon?: string
  attribute?: string
  unit?: string
  decimals?: number
  template?: string
  type?: 'relativetime' | 'template'
}

export interface TemplatedSensor {
  template: string
  label?: string | false
  entity?: string
}

export interface PreparedSensor {
  id: string
  label: string | false
  entityId: string
  template: string
  context: LooseObject
}

export interface Sensor extends ConfigSensor {
  state: any
}

export interface HASS {
  states?: Record<string, any>
  [key: string]: any
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

export interface ControlModeOption {
  value: string
  name: string
  icon: string
}
export interface ControlMode {
  type: string
  mode: any
  name?: string | boolean
  hide_when_off?: boolean
  list: Array<ControlModeOption>
}
