import { Setpoints } from '../types'
import getEntityType from '../getEntityType'
const DUAL = 'dual' as const

export default function parseSetpoints(
  setpoints: Setpoints | false,
  attributes: any
) {
  if (setpoints) {
    const def = Object.keys(setpoints)
    return def.reduce((result, name: string) => {
      const sp = setpoints[name]
      if (sp?.hide) return result
      return {
        ...result,
        [name]: attributes?.[name],
      }
    }, {})
  }
  const entityType = getEntityType(attributes)
  if (entityType === DUAL) {
    return {
      target_temp_low: attributes.target_temp_low,
      target_temp_high: attributes.target_temp_high,
    }
  }
  return {
    temperature: attributes.temperature,
  }
}
