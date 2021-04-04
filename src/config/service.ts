export interface Service {
  domain: string
  service: string
  data?: {
    [key: string]: string
  }
}

export default function parseServie(config: false | Service): Service {
  if (!config) {
    return {
      domain: 'climate',
      service: 'set_temperature',
    }
  }
  return config
}
