import { LooseObject } from './types'

export default function isEqual(a: LooseObject, b: LooseObject) {
  const keys = Object.keys(a)

  if (keys.length !== Object.keys(b).length) {
    return false
  }

  return !keys.some((key) => a?.[key] !== b?.[key])
}
