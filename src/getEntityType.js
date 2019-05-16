export const DUAL = 'dual'
export const SINGLE = 'single'

export default function getEntityType(attributes) {
  if (
    typeof attributes.target_temp_high === 'number' &&
    typeof attributes.target_temp_low === 'number'
  ) {
    return DUAL
  }
  return SINGLE
}
