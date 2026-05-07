export interface Service {
  domain: string
  service: string
  data?: {
    [key: string]: any
  }
}

export default function parseService(config: false | Service): Service {
  if (!config) {
    return {
      domain: 'climate',
      service: 'set_temperature',
    }
  }
  return config
}
