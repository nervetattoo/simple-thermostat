import { HeaderConfig } from './header'
import { LooseObject, ConfigSensor } from '../types'
import { Service } from './service'
import { Setpoints } from './setpoints'

export enum MODES {
  HVAC = 'hvac',
  FAN = 'fan',
  PRESET = 'preset',
  SWING = 'swing',
}

type ControlItem =
  | boolean
  | {
      name?: string | false
      icon?: string | false
    }

export type ControlField = Record<string, ControlItem> & {
  _name: string
  _hide_when_off: boolean
}

type ControlObject = {
  hvac: boolean | ControlField
  fan: boolean | ControlField
  preset: boolean | ControlField
  swing: boolean | ControlField
}

interface CardConfig {
  entity?: string
  header: false | HeaderConfig
  control?: false | ControlObject | string[]
  sensors?: false | Array<ConfigSensor>
  setpoints?: Setpoints
  decimals?: number
  step_size?: number
  layout?: {
    mode: {
      names: boolean
      icons: boolean
      headings: boolean
    }
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

export { CardConfig }
