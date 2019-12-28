import round from 'lodash.round'
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

  return round(number, decimals)
}

export default formatNumber
