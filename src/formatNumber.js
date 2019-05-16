const NA = 'N/A'

function formatNumber(number, { decimals = 1, fallback = 'N/A' } = {}) {
  const type = typeof number
  if (
    number === null ||
    number === '' ||
    ['boolean', 'undefined'].includes(type)
  ) {
    return fallback
  }
  const [int, dec] = String(number).split('.')
  if (Number.isNaN(int)) {
    return fallback
  }
  if (decimals) {
    return `${int}.${dec || '0'}`
  } else {
    return String(Math.round(number))
  }
}

export default formatNumber
