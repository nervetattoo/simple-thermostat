import { HeaderConfig } from './header'
import { LooseObject, ConfigSensor } from '../types'
import { Service } from './service'
import { Setpoints } from './setpoints'

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
      type: 'table' | 'list'
      labels: boolean
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
