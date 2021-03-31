import { Service } from '../types'

export default function parseServie(config: false | Service): Service {
  if (!config) {
    return {
      domain: 'climate',
      service: 'set_temperature',
    }
  }
  return config
}
