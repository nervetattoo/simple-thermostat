import { HeaderConfig } from './header'
import { LooseObject, ConfigSensor, TemplatedSensor } from '../types'
import { Service } from './service'
import { Setpoints } from './setpoints'

export enum MODES {
  HVAC = 'hvac',
  FAN = 'fan',
  PRESET = 'preset',
  SWING = 'swing',
}

export type ModeValue = {
  name?: string | false
  icon?: string | false
  include?: boolean
}

/**
 * Represents the available mode values for a mode
 *
 */
export type ModeControlObject = Record<string, boolean | ModeValue> & {
  _name: string
  _hide_when_off: boolean
}

/**
 * Modes (hvac, fac, preset, swing)
 * that might exist as attributes on a climate entity.
 * Modes can be set to a value based on a list of options
 * that are provided in the attributes of the entity.
 *
 */
export type ModeControlValue = boolean | ModeControlObject
type ModeControl = {
  hvac: ModeControlValue
  fan: ModeControlValue
  preset: ModeControlValue
  swing: ModeControlValue
}

interface CardConfig {
  entity?: string
  header: false | HeaderConfig
  control?: false | ModeControl | string[]
  sensors?: false | Array<ConfigSensor & TemplatedSensor>
  version: 2 | 3
  setpoints?: Setpoints
  decimals?: number
  step_size?: number
  variables?: LooseObject
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
