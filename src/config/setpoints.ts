import getEntityType, { DUAL } from '../getEntityType'

export interface Setpoint {
  hide?: boolean
}

export type Setpoints = Record<string, Setpoint>

export default function parseSetpoints(
  setpoints: Setpoints | false | undefined,
  attributes: any
) {
  if (setpoints === false) {
    return {}
  }

  if (setpoints) {
    return Object.entries(setpoints).reduce((result, [name, sp]) => {
      if (sp?.hide) return result
      result[name] = attributes?.[name]
      return result
    }, {} as Record<string, any>)
  }

  if (getEntityType(attributes) === DUAL) {
    return {
      target_temp_low: attributes.target_temp_low,
      target_temp_high: attributes.target_temp_high,
    }
  }
  return {
    temperature: attributes.temperature,
  }
}
