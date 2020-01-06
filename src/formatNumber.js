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

  return Number(number).toFixed(decimals)
}

export default formatNumber
